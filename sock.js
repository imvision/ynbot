var http    =   require('http');
var fs      =   require('fs');
var express = require('express');


// Creation du serveur
var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
app.set('views', __dirname + '/views')
app.use("/styles", express.static(__dirname + '/styles'));
app.set('view engine', 'jade')
app.use(express.logger('dev'))

app.get('/', function(req, res) {
    res.render('index.ejs');
});

// Socket io ecoute maintenant notre application !



///////////////////

// Notre application ecoute sur le port 8080
app.listen(80);
console.log('Live Chat App running at http://localhost:8080/');