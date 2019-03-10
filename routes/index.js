var express = require("express");
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require('passport');
const saltRounds = 10;
const db = require('../db.js');

router.use(function (req,res,next) {
	console.log("/" + req.method);
	next();
});
  
router.post("/login", function(req, res){
	var username = req.body.uname;
	// let hash = bcrypt.hashSync(req.body.psw, 10);
	var password = req.body.psw;

	db.query('SELECT * FROM user_account WHERE username = $1', [username], (error, results) => {
		if (error) {
			console.log("error ocurred",error);
			res.send({
				"code":400,
				"failed":"error ocurred"
			})
		}
		else {
			var field = results.rows[0];
			if(Object.keys(field).length > 0){
				if(field["password"] == password){
					res.send({
						"code": 200,
						"success": "login sucessfull"
					});
				}
				else {
					res.send({
						"code": 204,
						"success": "Email and password does not match"
					});
				}
			}
			else{
				res.send({
					"code": 204,
					"success": "Email does not exits"
				});
			}
		}
	});


	console.log("Username:" + username + ", Password:" + password)
});

router.post("/register", function(req, res){
	req.checkBody('username', 'Username field cannot be empty').notEmpty();
	req.checkBody('username', 'Username must be between 3-20 characters long.').len(3, 20);
	req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
	req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
	req.checkBody('psw', 'Password must be between 8-100 characters long.').len(8, 100);
	req.checkBody('psw_repeat', 'Password must be between 8-100 characters long.').len(8, 100);
	req.checkBody('psw_repeat', 'Passwords do not match, please try again.').equals(req.body.psw);

	const errors = req.validationErrors();

	if(errors) {
		console.log(`errors: ${JSON.stringify(errors)}`);

		res.render('loginPage', {errors: errors});
	}
	else {
		var username = req.body.username;
		// var hash = bcrypt.hashSync(req.body.psw, 10);
		var password = req.body.psw;
		var email = req.body.email;
		var passRepeat = req.body.psw_repeat
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

		console.log(`Username: ${username}, Password: ${password}, Email: ${email}, Reapet Password: ${passRepeat}`)
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

		res.redirect('/');
	}
}

router.get("/",function(req,res){
	console.log(req.user);
	console.log(req.isAuthenticated());
	res.render('loginPage');
});

router.get("/search", authenticationMiddleware(), (req,res) => {
	res.render('search');
});

router.get("/about",function(req,res){
	res.render('about');
});

router.get("/contact",function(req,res){
	res.render('contact');
});

router.get("/document", authenticationMiddleware(), (req,res) => {
	res.render('document');
});

module.exports = router;