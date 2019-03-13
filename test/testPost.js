var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('Testing the POST requests', function() {
    it('should log in a user at /login POST', function(done) {
        chai.request('http://localhost:8000')
            .post('/login')
            .send({"username":"testing","password":"password"})
            .end(function(err, res) {
                if (err) done(err);
                res.should.have.status(200);
            });
            done();
    });
    it('should register a user at /register POST', function(done) {
        chai.request('http://localhost:8000')
            .post('/register')
            .send({"email":"testing1@example.com","username":"test1","password":"password","passMatch":"password"})
            .end(function(err, res) {
                if (err) done(err);
                res.should.have.status(200);
            });
            done();
    });
});

