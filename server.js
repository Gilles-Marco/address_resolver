var express = require('express');
var app = express();
var http = require('http').createServer(app);
var fs = require('fs');

app.use(express.static("web"));

app.get("/", function(req, res){
    res.header(200);
    res.sendFile(__dirname+"/web/adress_resolver.html");
    var ip = req.connection.remoteAddress.substr(7);
    fs.appendFile('log.txt', `${getDateTime()} ${ip} :  Connexion\n`);
});

http.listen(8080);

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + day + ":" + month + ":" + hour + ":" + min + ":" + sec;

}