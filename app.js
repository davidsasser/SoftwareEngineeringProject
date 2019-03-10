var express = require("express");
var path = require('path');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');

var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var expressValidator = require('express-validator');
var passport = require('passport');


const db = require('./db.js');
var index = require('./routes/index');

var app = express();

app.use(cookieParser());
app.use(session({
  store: new pgSession({
    pool : db,                // Connection pool
    tableName : 'session'   // Use another table-name than the default "session" one
  }),
  secret: process.env.FOO_COOKIE_SECRET,
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/assets'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(expressValidator());

app.use("/", index);

app.listen(8000,function(){
  console.log("Live at Port 8000");
});