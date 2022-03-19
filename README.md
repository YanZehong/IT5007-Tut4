# IT5007-Tut4 Singapore Railway System
github: https://github.com/YanZehong/IT5007-YZH.git

## Commands
### mongoDB test (CRUD)
```
screen mongod (ctrl+a+d)
mongo issuetracker --eval "db.issues.remove({})"
node scripts/testmongo.js
```

### Schema Initialization
```
mongo issuetracker scripts/init.mongo.js
```

### Compile and Run Express Server
```
npm run compile (or npx babel src --presets @babel/react --out-dir public)
npm start (or node server/server.js)
```

### Project set up
```
nvm install 10
nvm alias default 10
node --version
npm --version
npm install -g npm@6
npm init
npm install express
npm uninstall express
npm install express@4
npm install --save-dev @babel/core@7 @babel/cli@7
node_modules/.bin/babel --version
npx babel --version
npm install --save-dev @babel/preset-react@7
npx babel src --presets @babel/react --out-dir public
npm install nodemon@1
npm install graphql@0 apollo-server-express@2
npm install mongodb@3
```

## Framework
### React component
<HomePage /> Contain logic code for enabling buttons to display the relevant components. Define states and props for maintaining information that is persistent/shared between components.  

states:  
(1)"issues" for reservation list;  
(2)"blackissues" for black list;  
(3)"seatDict" for visual representation of reserved/unreserved tickets;  
(4)"showIssueFilter"/"showIssueTable"/"showIssueAdd"... for component switch.  

Child Components:  
- IssueAdd: add traveller  
- BlackIssueAdd: add a person name to black list  
- IssueDelete: delete a traveller  from reservation list
- DisplayTraveller and IssueRow: display reservation list  
- DisplaySeat: visualization of avaliable seats  
- IssueFilter: welcome message  

## Corner Cases
- underflow and overflow (<0 or >25)- 'Error: Invalid Seat Number';  
- occupied slots- 'Occupied Seat~';  
- failed reserve- 'Failed~' for 'Invalid input(s)': (1) 'Field "name" contains number'; (2) 'Field "phone" is required when "name" is assigned'; (3) 'Field "phone" cannot contain alphabetical characters'; (4) 'INTERNAL_SERVER_ERROR: Invalid name in blacklist'.  

## Demonstration
<image src="/images/overview.png"/>