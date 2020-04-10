var express = require('express'),
session = require('express-session'),
MongoStore = require('connect-mongo')(session),
mongoose = require('mongoose'),
bodyParser  = require("body-parser"),
app = express();

//Flash is used to display message
const flash = require('express-flash')
//MEthod override we used Here to convert post request into put request as put request is not default in node
const methodOverride = require('method-override')

//Import passport config and routes for authentication and authorization
const passport = require('./passport/setup');
const auth = require('./routes/auth');

//MongoDB local database
//db name : test
const URI = "mongodb://localhost/test";

mongoose
  .connect(URI, {useNewUrlParser : true})
  .then(console.log(`MongoDB connected ${URI}`))
  .catch(err => console.log(err));

//EJS as default view-engine
app.set('view-engine', 'ejs');
app.use(express.json());
app.use(flash());
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride('_method'));
// app.use(express.urlencoded({extended : false}));

//Used to store session, currently no expiry until logout
app.use(
  session({
    secret : "Very SCRET",
    resave : false,
    saveUninititalized : true,
    store : new MongoStore({ mongooseConnection : mongoose.connection })
  })
);

app.use(passport.initialize());
app.use(passport.session());

//This is a route to get details of all the people whose temperature are greater than normal.
app.post("/sendTemperature", function(req, res){
  console.log(req.body);
  //We get thier number, longitue, and latitude
  console.log("Danger at : ", req.body.email);
  console.log("X Coordinate : ", req.body.x);
  console.log("Y Coordinate : ", req.body.y);
  return res.sendStatus(200);
})

//Whenever anyone try to get to main page it will first check for authentication
app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name : "Welcome Doctor", person: [] })
})

app.get('/xyDetails', checkAuthenticated, (req, res) => {
  res.render('coordinate.ejs', {Coordinate: [] })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.post('/auth/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


app.use("/user_info", auth);

//Add your own ipv4 address, port number for doctor server is 3001
app.listen(3001,'192.168.43.44' || 'localhost',function() {
    console.log('Application worker ' + process.pid + ' started...');
  }
  );
