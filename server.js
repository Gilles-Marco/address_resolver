var app = require('express')();
var http = require('http').createServer(app);

app.use(express.static("web"));

app.get("/", function(req, res){
    res.header(200);
    res.sendFile(__dirname+"/adress_resolver.html");
});
http.listen(8080);