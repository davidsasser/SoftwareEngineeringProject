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
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// include all of our js modules
var db = require('./helpers/db.js');
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
    inc: function(value, options) { return parseInt(value) + 1; }
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

// to store whether a user is an administrator
app.use(function(req, res, next) {
  if (req.user != null) {
    res.locals.isAdmin = req.user.role;
  }
  next();
});

// to load homepage
app.use("/", index);

app.post("/request_add", (req,res) => {
	let sampleFile = req.files.sampleFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./scripts/docs/' + sampleFile.name, function(err) {
    if (err)
      return res.status(500).send(err);
      db.query('INSERT INTO requests(doc_name, request_type) VALUES ($1, \'add\')', [sampleFile.name], function(err, results, fields) {
        if(err) {done(err)}

      });
  });
	res.redirect('/')
});

// authenticate the user
passport.use(new LocalStrategy(
  function(username, password, done) {
    db.query('SELECT user_id, password, is_admin FROM user_account WHERE username = $1', [username], function(err, results, fields) {
      if(err) {done(err)}

      if (results.length == 0) {
        done(null, false);
      }
      else {
        const hash = results.rows[0].password.toString();
        bcrypt.compare(password, hash, function(err, response) {
          if (response == true) {
            var today = new Date();
            var last_login = today.toISOString().split('.')[0]+"Z";
            db.query('UPDATE user_account SET last_login = $1 WHERE username = $2', [last_login, username], function(err1, results1, fields1) {
              if(err1) {done(err1)}
              return done(null, {user_id: results.rows[0].user_id, role: results.rows[0].is_admin});
            });
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