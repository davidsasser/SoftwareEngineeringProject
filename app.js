var express = require("express");
var path = require('path');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');

var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash-notification');
var bcrypt = require('bcrypt');

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
app.use(flash(app));
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

var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(function(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});
app.use("/", index);

passport.use(new LocalStrategy(
  function(username, password, done) {
      console.log(username)
      console.log(password)

      db.query('SELECT user_id, password FROM user_account WHERE username = $1', [username], function(err, results, fields) {
        if(err) {done(err)}

        if (results.length == 0) {
          done(null, false);
        }
        else {
          const hash = results.rows[0].password.toString();

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

app.listen(8000,function(){
  console.log("Live at Port 8000");
});