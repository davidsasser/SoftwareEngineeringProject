var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

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
});


