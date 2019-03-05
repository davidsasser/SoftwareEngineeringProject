var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

app.use(express.static(__dirname + '/assets'));

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
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