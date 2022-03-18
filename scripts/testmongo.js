const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/issuetracker';

// Atlas URL  - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true';

// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';

function testWithCallbacks(callback) {
  console.log('\n--- testWithCallbacks ---');
  const client = new MongoClient(url, { useUnifiedTopology: true });
  client.connect(function(err, client) {
    if (err) {
      callback(err);
      return;
    }
    console.log('Connected to MongoDB');

    const db = client.db();
    const traveller_collection = db.collection('issues');
    traveller_collection.deleteMany({});

    const traveller = { name: 'A. Callback1', phone: '80391111', seatid: 1 };
    const travellers = [{ name: 'A. Callback2', phone: '80392222', seatid: 2 },
                        { name: 'A. Callback3', phone: '80393333', seatid: 3 },];
    // test create one
    traveller_collection.insertOne(traveller, function(err, result) {
      if (err) {
        client.close();
        callback(err);
        return;
      }
      console.log('Result of insert:\n', result.insertedId);
      // test read
      traveller_collection.find({ _id: result.insertedId})
        .toArray(function(err, docs) {
        if (err) {
          client.close();
          callback(err);
          return;
        }
        console.log('Result of find:\n', docs);
      });
      // test update
      traveller_collection.updateOne({ _id: result.insertedId}, { $set: {name: "A. Callback Update"} }, function(err, upres) {
        if (err) {
          client.close();
          callback(err);
          return;
        }
      });
      traveller_collection.find({ _id: result.insertedId})
          .toArray(function(err, updocs) {
          if (err) {
            client.close();
            callback(err);
            return;
          }
          console.log('Result of update:\n', updocs);
        });
      // test delete
      traveller_collection.deleteOne({ _id: result.insertedId});
      traveller_collection.find({ _id: result.insertedId})
        .toArray(function(err, after_docs) {
        if (err) {
          client.close();
          callback(err);
          return;
        }
        console.log('Result of delete:\n', after_docs);
      });
    });
    // test create many
    traveller_collection.insertMany(travellers, function(err, results) {
      if (err) {
        client.close();
        callback(err);
        return;
      }
      traveller_collection.find({})
        .toArray(function(err, docs) {
        if (err) {
          client.close();
          callback(err);
          return;
        }
        console.log('Result of insert many:\n', docs);
        client.close();
        callback(err);
      });
    });
  });
}

async function testWithAsync() {
  console.log('\n--- testWithAsync ---');
  const client = new MongoClient(url, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db();
    const traveller_collection = db.collection('issues');
    traveller_collection.deleteMany({});

    const traveller = { name: 'B. Async', phone: '80004444', seatid: 4 };
    // test add
    const result = await traveller_collection.insertOne(traveller);
    console.log('Result of insert:\n', result.insertedId);
    // test read
    const docs = await traveller_collection.find({ _id: result.insertedId })
      .toArray();
    console.log('Result of find:\n', docs);
    // test delete
    const delete_result = await traveller_collection.deleteOne({ _id: result.insertedId });
    const after_docs = await traveller_collection.find({ _id: result.insertedId })
      .toArray();
    console.log('Result of delete:\n', after_docs);
  } catch(err) {
    console.log(err);
  } finally {
    client.close();
  }
}

testWithCallbacks(function(err) {
  if (err) {
    console.log(err);
  }
  testWithAsync();
});