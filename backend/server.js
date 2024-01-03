const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const cookie = require("cookie-session");
const cors = require('cors');
const app = express()
const env = require('dotenv').config()
const http = require('http');
const { create } = require("domain");

let corsOptions = {
  origin: 'https://wpi-clicker.glitch.me/frontend/'
}

app.use(cors(corsOptions))

var allowlist = ['https://wpi-clicker.glitch.me/frontend/', 'https://wpi-clicker.glitch.me/backend/']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate))

// defaut form actions
// or GET requests
app.use(express.urlencoded({ extended: true }));

// COOKIE MIDDLEWARE
app.use(
    cookie({
      name: "session",
      keys: ["4zFTJx2rVu3AkB", "aMPnwJ9c4f4DZy"]
    })
);

app.use(function(req, res, next) {
  console.log("origin: " + req.headers.origin)
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {    
    origin: true,
    credentials: true
  },
  allowEIO3: true
})

// DB SETUP
const uri = "mongodb+srv://"+process.env.DBUSERNAME+":"+process.env.DBPASSWORD+"@mycluster.xfjchh0.mongodb.net";
console.log(uri);

const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let collection = null;

client
.connect()
.then(() => {
  // will only create collection if it doesn't exist
  return client.db("clicker-database").collection("clicker-data");
})
.then(__collection => {
  // store reference to collection
  collection = __collection;
});

let activeUsers=[]
let activeUsersData=[]
let activeUsersSockets=[]

io.on('connection', (socket) => {
  console.log("LOGGING: Connection IP: " + socket.request.connection.remoteAddress)
  activeUsers.push(socket.id)
  activeUsersData.push({
    username: socket.id,
    currScore : 0,
    totalScore : 0,
    prodUpgrades : {0:0, 1:0, 2:0, 3:0, 4:0},
    clickUpgrades : {0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0},
    lastPlayed : 0,
    activated: false})
  activeUsersSockets.push(socket)

  console.log('Connected Users: '+ activeUsers.length)

  socket.on('update', (updateData) => {
    console.log("Update");

    let index = activeUsers.indexOf(socket.id);
    activeUsersData[index].currScore = updateData.score;
    if(updateData.production === null){
      console.log("UPDATE DATA SETTING TO ARRAY OR NULL INSTEAD OF MAP")
    }
    activeUsersData[index].prodUpgrades = updateData.production;
    activeUsersData[index].clickUpgrades = updateData.click;

    let liveScores = []
    activeUsersData
    .forEach(activeUser => {
      if(activeUser.activated){
        liveScores.push({
          score: activeUser.currScore,
          username: activeUser.username
        })
      }
    })

    console.log('LIVESCORES:', liveScores)
    io.emit( 'updateScores', liveScores )
  })


  socket.on('fetchScore', (username)=> {
    console.log("fetchScore");
    socket.emit("fetchScore", activeUsersData[activeUsers.indexOf(socket.id)])
  })

  socket.on('login', (username) => {
    console.log("Login: " + username);
    let index = activeUsers.indexOf(socket.id);
    collection.findOne({username: username}, function (
        err,
        userEntry
    ) {
      if (err) throw err;
      if (userEntry === null) {
        // if login doesnt exist -> new account
        console.log("Registering New User ...");
        activeUsersData[index].username = username;
        activeUsersData[index].activated = true;
        delete activeUsersData[index]['_id']
        collection.insertOne(
            activeUsersData[index],
            function(err, createdQuery) {
              // console.log(createdQuery);
              if (err) throw err;
              if (createdQuery === null) {
                // error inserting, try logining in again
                activeUsersData[index].username = 'Anonymous User';
                activeUsersData[index].activated = false;
                console.log("ERROR LOGGING IN")
              } else {
                console.log("ACCOUNT CREATED")
                // setup new account
                // console.log('createdQuery', createdQuery)
                // activeUsersData[index] = createdQuery;
              }
            }
        );
      } else {
        // already exists, check login
        console.log("LOGGED IN: " + userEntry)
        activeUsersData[index] = userEntry
        socket.emit("login", userEntry)
      }
    });
  })

  /*
  socket.on('fetchAllScores', ()=> {
    getAllUserInfo().then(result => socket.emit("fetchAllScores", result))
  })
  */

  socket.on('disconnect', () => {
    console.log("Disconnect");
    //console.log(activeUsers, activeUsersData, socket.id)
    let index = activeUsers.indexOf(socket.id)
    if(activeUsersData[index].activated){
      activeUsersData[index]['lastPlayed'] = Date.now();
      let id = activeUsersData[index]['_id']
      delete activeUsersData[index]['_id']
      console.log(activeUsersData[index])

      collection.findOneAndReplace({_id : mongodb.ObjectId(id)}, activeUsersData[index]).then(console.log)
    }
    activeUsers.splice(index, 1);
    activeUsersData.splice(index, 1);
    activeUsersSockets.splice(index, 1);
    console.log('Connected Users: '+activeUsers.length)
  })
  
})

const getUserInfo = function(user) {
  return collection.findOne({ username: user })
};


const getAllUserInfo = function() {
  return collection.find({}).toArray();
};

// LOGIN / CREATE ACCOUNT
app.post("/login", (req, res) => {
  console.log("User activity detected!");
  if(req.body.username === undefined) {
    res.json({"login": "FAILURE: username null"});
  } else {
    collection.findOne({username: req.body.username}, function (
        err,
        userEntry
    ) {
      if (err) throw err;
      if (userEntry === null) {
        // if login doesnt exist -> new account
        createAccount(req, res, collection);
      } else {
        // already exists, check login
        redirectAuthedUser(req, res, req.body.username);
      }
    });
  }
})

const createAccount = function(req, res, usersDb) {
  console.log("Registering New User ...");
  usersDb.insertOne(
      { username: req.body.username, currScore: 0, totalScore: 0, prodUpgrades: [], clickUpgrades: [] },
      function(err, createdQuery) {
        console.log(createdQuery);
        if (err) throw err;
        if (createdQuery === null) {
          // error inserting, try logining in again
          res.json({"login": "FAILURE"});
        } else {
          // setup new account
          redirectAuthedUser(req, res, req.body.username);
        }
      }
  );
};

const redirectAuthedUser = function(req, res, username) {
  req.session.login = true;
  req.session.username = username;
  console.log("Before Redirect Session Id: " + req.session.username);
  res.json({"login": "SUCCESS"});
};

app.get('/logout', (req, res) => {
  req.session = null;
  res.json({"logout": "SUCCESS"});
})

app.get('/', (req, res) => {
  console.log('redirecting to index.html')
  res.sendFile(__dirname + "/public/index.html");
})

app.use(function(req, res, next) {
  if (req.session.login === true || req.originalUrl === '/login.html' || req.originalUrl.includes('.css')) {
    next();
  } else {
    res.sendFile(__dirname + "/public/login.html");
  }
});

// Express setup
app.use(express.static("./public/"));

//http.listen(4568)

// Listen!!!
const listener = server.listen(process.env.PORT || 3001, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
