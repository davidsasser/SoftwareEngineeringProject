var express = require("express");
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require('passport');
const saltRounds = 10;
const db = require('../db.js');
const flash = require('express-flash-notification');


var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

router.use(function (req,res,next) {
	console.log("/" + req.method);
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
	console.log(req.user);
	console.log(req.isAuthenticated());
	res.render('index', {active: { home: true }});
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