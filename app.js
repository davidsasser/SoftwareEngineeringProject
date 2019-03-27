// inlcude all of our necessary libraries
var express = require("express");
var path = require('path');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('express-flash-notification');
var bcrypt = require('bcrypt');
var ejs = require('ejs');
var engines = require('consolidate');
var app = express();

// include all of our js modules
var db = require('./db.js');
var index = require('./routes/index.js');

app.use(cookieParser());
app.use(session({
  store: new pgSession({
    pool : db,                // Connection pool
    tableName : 'session'
  }),
  secret: process.env.FOO_COOKIE_SECRET,
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));
app.use(flash(app));
app.use(passport.initialize());
app.use(passport.session());

// to include out css and handlebar files

app.use(express.static(__dirname + '/assets'));
app.set('views', path.join(__dirname, 'views'));
//app.engine('ejs', engines.ejs);

//app.engine('handlebars', engines.handlebars);
app.set('view engine', 'hbs');
var hbs = require('express-handlebars');

app.engine('hbs', hbs({
  extname: 'hbs',  
  partialsDir  : [
      //  path to your partials
      path.join(__dirname, 'views/partials'),
  ],
  helpers: {
    json: function (context, options) { return JSON.stringify(context); }
  }
}));


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(expressValidator());

// to store whether a user is logged in
app.use(function(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// to load homepage
app.use("/", index);

// authenticate the user
passport.use(new LocalStrategy(
  function(username, password, done) {

      db.query('SELECT user_id, password FROM user_account WHERE username = $1', [username], function(err, results, fields) {
        if(err) {done(err)}

        if (results.length == 0) {
          done(null, false);
        }
        else {
          const hash = results.rows[0].password.toString();
          console.log(typeof results.rows[0].needsPasswordChange)
          bcrypt.compare(password, hash, function(err, response) {
            if (response == true) {
              return done(null, {user_id: results.rows[0].user_id});
            }
            else {
              return done(null, false);
            }
          });
        }
      })
  }
));

// starts the server instance
app.listen(8000,function(){
  console.log("Live at Port 8000");
});

module.exports = app