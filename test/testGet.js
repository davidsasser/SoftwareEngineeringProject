var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

// var webdriver = require('../node_modules/selenium-webdriver'),
//    test = require('../node_modules/selenium-webdriver/testing'),
//    remote = require('../node_modules/selenium-webdriver/remote');

chai.use(chaiHttp);

describe('Testing the GET requests', function() {
    it('should go to /login GET for homepage', function(done) {
        chai.request('http://localhost:8000')
          .get('/login')
          .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });
    it('should go to / GET for login page', function(done) {
        chai.request('http://localhost:8000')
          .get('/')
          .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });
    it('should go to /register GET for register page', function(done) {
        chai.request('http://localhost:8000')
          .get('/register')
          .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });
    it('should go to /register GET for register page', function(done) {
        chai.request('http://localhost:8000')
          .get('/register')
          .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });
    it('should go to /register GET for register page', function(done) {
        chai.request('http://localhost:8000')
          .get('/register')
          .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });
    it('should go to /register GET for register page', function(done) {
        chai.request('http://localhost:8000')
          .get('/register')
          .end(function(err, res){
            res.should.have.status(200);
            done();
        });
    });
});


