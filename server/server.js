const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/issuetracker';

// Atlas URL  - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true';

// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';

let db;

let aboutMessage = "Issue Tracker API v1.0";

const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'A Date() type in GraphQL as a scalar',
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    const dateValue = new Date(value);
    return isNaN(dateValue) ? undefined : dateValue;
  },
  parseLiteral(ast) {
    if (ast.kind == Kind.STRING) {
      const value = new Date(ast.value);
      return isNaN(value) ? undefined : value;
    }
  },
});

const resolvers = {
  Query: {
    about: () => aboutMessage,
    issueList,
  },
  Mutation: {
    setAboutMessage,
    issueAdd,
    blackissueAdd,
    issueDelete,
  },
  GraphQLDate,
};

function setAboutMessage(_, { message }) {
  return aboutMessage = message;
}

async function issueList() {
  const issues = await db.collection('issues').find({}).toArray();
  return issues;
}

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

function issueValidate(issue) {
  const errors = [];
  if (/\d/.test(issue.name)) {
    errors.push('Field "name" contains number.');
  }
  if (issue.name.length > 0 && !issue.phone) {
    errors.push('Field "phone" is required when "name" is assigned');
  }
  if (/[a-zA-Z]/i.test(issue.phone)) {
    errors.push('Field "phone" cannot contain alphabetical characters');
  }
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}

async function blackissueAdd(_, { blackissue }) {
    await db.collection('counters').findOneAndUpdate(
      { _id: 'blackissues' },
      { $inc: { current_bl: 1 } },
      { returnOriginal: false },
    );
    const blackresult = await db.collection('blackissues').insertOne(blackissue);
    const savedBlackIssue = await db.collection('blackissues')
        .findOne({ _id: blackresult.insertedId });
    return savedBlackIssue;
}

async function issueAdd(_, { issue }) {
  var savedIssue;
  issueValidate(issue);
  /*
  * check blacklist
  */
  const blacklistFind = await db.collection('blackissues').find({name: issue.name}).count();
  if (blacklistFind > 0) {
    throw new Error('Invalid name in blacklist');
  }
  else {
    issue.created = new Date();
    await getNextSequence('issues');
    const result = await db.collection('issues').insertOne(issue);
    savedIssue = await db.collection('issues')
        .findOne({ _id: result.insertedId });
  }
  return savedIssue;
}

async function issueDelete(_, { name }) {
  var findID;
  const issueFind = await db.collection('issues').findOne({name: name});
  const issueCnt = await db.collection('issues').find({name: name}).count();
  if (issueCnt > 0) {
    await db.collection('issues').deleteOne({name: name});
    const result = await db.collection('counters').findOneAndUpdate(
      { _id: 'issues' },
      { $inc: { current: -1 } },
      { returnOriginal: false },
    );
    findID = issueFind.seatid;
  }
  else {
    throw new Error('Name not found in Reservation List');
  }
  return findID;
}

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
});

const app = express();

app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

(async function () {
  try {
    await connectToDb();
    app.listen(3000, function () {
      console.log('App started on port 3000');
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();