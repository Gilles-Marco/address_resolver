var app = require('express')();
var http = require('http').createServer(app);

app.get("/", function(req, res){
    res.header(200);
    res.sendFile(__dirname+"/adress_resolver.html");
})
.get('/adress_resolver.js', function(req, res){
    res.header(200);
    res.sendFile(__dirname+"/adress_resolver.js");
})
.get('/style.css', function(req, res){
    res.header(200);
    res.sendFile(__dirname+"/style.css");
})
.get('/help.html', function(req, res){
    res.header(200);
    res.sendFile(__dirname+"/help.html");
})
.get('/help.css', function(req, res){
    res.header(200);
    res.sendFile(__dirname+"/help.css");
});

http.listen(8080);