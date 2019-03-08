var express = require("express");
var app = express();
const bodyParser = require('body-parser')
var router = express.Router();
var path = __dirname + '/views/';
var https = require("https");
var bcrypt = require('bcrypt');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Group_C',
  password: 'postgres',
  port: 5432,
})

app.use(express.static(__dirname + '/assets'));

router.use(bodyParser.json());       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.post("/login", function(req, res){
  var username = req.body.uname;
  // let hash = bcrypt.hashSync(req.body.psw, 10);
  var password = req.body.psw;

  /* const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/login',
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      'username': username,
      'password': password
    }
  };

  const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  }); */
  pool.query('SELECT * FROM user_account WHERE username = $1', [username], (error, results) => {
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

router.get("/",function(req,res){
  res.sendFile(path + "loginPage.html");
});

router.get("/search",function(req,res){
  res.sendFile(path + "search.html");
});

router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});

router.get("/contact",function(req,res){
  res.sendFile(path + "contact.html");
});

router.get("/document",function(req,res){
  res.sendFile(path + "document.html");
});

app.use("/",router);

app.listen(8000,function(){
  console.log("Live at Port 8000");
});