var express = require("express");
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require('passport');
const saltRounds = 10;
const db = require('../db.js');
const flash = require('express-flash-notification');
var nodemailer = require('nodemailer');
const jwt = require('jwt-simple');

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

router.use(function (req,res,next) {
	//console.log("/" + req.method);
	next();
});
  
router.post('/login', passport.authenticate('local', {
	successRedirect: '/search',
	failureRedirect: '/login'
}));

router.get('/logout', (req, res) => {
	req.logout();
	req.session.destroy();
	res.redirect('/');
})

router.get('/resetpassword/:id/:token', (req, res) => {
    db.query('SELECT password, created_on FROM user_account WHERE user_id = $1', [req.params.id], function(err, results, fields) {
		var password = results.rows[0].password;
		var created_on = results.rows[0].created_on;

		var secret = `${password}-${created_on}`;
		var payload = jwt.decode(req.params.token, secret);


/* 		res.send('<form action="/resetpassword" method="POST">' +
			'<input type="hidden" name="id" value="' + payload.id + '" />' +
			'<input type="hidden" name="token" value="' + req.params.token + '" />' +
			'<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
			'<input type="submit" value="Reset Password" />' +
		'</form>'); */
		res.render('resetPassword', {id: payload.id, token: req.params.token});
	});
});
router.post('/resetpassword', (req, res) => {
	db.query('SELECT password, created_on FROM user_account WHERE user_id = $1', [req.body.id], function(err, results, fields) {
		if(err) {done(err)}

		var password = results.rows[0].password;
		var created_on = results.rows[0].created_on;

		var secret = `${password}-${created_on}`;
		var payload = jwt.decode(req.body.token, secret);

		bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
			db.query('UPDATE user_account SET password = $1 WHERE user_id = $2', [hash, req.body.id], function(err, results, fields) {
				if(err) {done(err)}

			});
		});
		res.redirect('/login')
	});
})

router.get('/forgotpassword', (req, res) => {
	res.render('forgotPassword');
})
router.post('/forgotpassword', (req, res) => {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
		  user: process.env.EMAIL_USER,
		  pass: process.env.EMAIL_PASSWORD
		}
	});
	var username = req.body.username;
	db.query('SELECT user_id, password, email, created_on FROM user_account WHERE username = $1', [username], function(err, results, fields) {
		if(err) {done(err)}
		
		if(typeof results.rows[0] !== 'undefined') {
			var email = results.rows[0].email;
			var user_id = results.rows[0].user_id;
			var password = results.rows[0].password;
			var created_on = results.rows[0].created_on;

			var payload = {
				id: user_id,        // User ID from database
				email: email
			};
			var secret = `${password}-${created_on}`;
			var token = jwt.encode(payload, secret);
			var url = `http://localhost:8000/resetpassword/${payload.id}/${token}`
			var mailOptions = {
				from: process.env.EMAIL_FROM,
				to: process.env.EMAIL_TO, //email var needs to be used
				subject: 'Your password has been changed.',
				html: `<p>Please use the following link to change your password:</p><p><a href="${url}">Reset Password</a></p>`
			};
			
			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});
		}
		else {
			console.log("Username does not exist.")
		}
	});
})

router.post("/register", function(req, res){
	req.checkBody('username', 'Username field cannot be empty').notEmpty();
	req.checkBody('username', 'Username must be between 3-20 characters long.').len(3, 20);
	req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
	req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
	req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
	req.checkBody('passMatch', 'Password must be between 8-100 characters long.').len(8, 100);
	req.checkBody('passMatch', 'Passwords do not match, please try again.').equals(req.body.password);

	const errors = req.validationErrors();

	if(errors) {
		console.log(`errors: ${JSON.stringify(errors)}`);

		res.render('register', {errors: errors});
	}
	else {
		var username = req.body.username;
		// var hash = bcrypt.hashSync(req.body.psw, 10);
		var password = req.body.password;
		var email = req.body.email;
		var today = new Date();
		var created = today;
		var login = today;

		bcrypt.hash(password, saltRounds, (err, hash) => {
			db.query('INSERT INTO user_account (username, password, email, created_on, last_login) VALUES ($1, $2, $3, $4, $5) RETURNING user_id', [username, hash, email, created, login], (error, results) => {
				if (error) {
					console.log("error ocurred", error);
					res.send({
						"code":400,
						"failed":"error ocurred"
					})
				}
				else {
					var user_id = results.rows[0];
					req.login(user_id, (err) => {
						res.redirect('/search')
					});
				}
			})
		});
	}
});

passport.serializeUser((user_id, done) => {
	done(null, user_id);
})
passport.deserializeUser((user_id, done) => {
	done(null, user_id);
})

function authenticationMiddleware() {
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

		if (req.isAuthenticated()) return next();

		const error = 'You must login to view this page.'
		req.flash('info', error, '/')

		
	}
}

router.get("/",function(req,res){
	//console.log(req.user);
	//console.log(req.isAuthenticated());
	res.render('index', {active: { home: true }});
});

router.post("/search", authenticationMiddleware(), (req,res) => {
	var keywords = req.body.keyword
});
router.get("/search", authenticationMiddleware(), (req,res) => {
	

	res.render('search', {active: { search: true }});
});

router.get("/about",function(req,res){
	res.render('about', {active: { about: true }});
});

router.get("/login",function(req,res){
	res.render('login', {active: { login: true }});
});

router.get("/register",function(req,res){
	res.render('register', {active: { register: true }});
});

router.get("/document", authenticationMiddleware(), (req,res) => {
	res.render('document');
});

module.exports = router;