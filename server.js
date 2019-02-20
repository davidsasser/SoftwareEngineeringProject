var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

app.use(express.static(__dirname + '/assets/css'));

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "search.html");
});

app.use("/",router);

app.listen(8000,function(){
  console.log("Live at Port 8000");
});