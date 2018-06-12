var express = require('express');
var app = express();
var http = require('http').createServer(app);
var fs = require('fs');

app.use(express.static("web"));

app.get("/", function(req, res){
    res.header(200);
    res.sendFile(__dirname+"/web/adress_resolver.html");
    var ip = req.connection.remoteAddress.substr(7);
    fs.appendFile('log.txt', `${ip} :  Connexion\n`);
});

http.listen(8080);