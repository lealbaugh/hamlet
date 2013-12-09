// -------------GAME INFO---------------------------
var metaphone = require('./metaphone');
var languagemodel = require('./languagemodel');
var fs = require('fs');

var filename = "hamlet.txt";
var unigrams = require("./unigrams.json");
var bigrams = require("./bigrams.json");
//if these requires fail, languagemodel.init(filename);



function processintoArray(lines) {
	var text = lines.toLowerCase().replace(/['\[\]]/g,"").split(/[^A-z]+/); 
	return text;
}


// ----------------SERVER----------------------------
var http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000;
  // get port from environmental variable, as is the Heroku way

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(port, function() { console.log(this._connectionKey)});

console.log('http server listening on %d', port);

// Create a Socket.IO instance, passing it our server
var io = require('socket.io').listen(server);
io.set('log level', 1);

// Add a connect listener
io.sockets.on('connection', function(socket){ 

	socket.on('message',function(event){ 
		console.log('Message: ',event);
	});

	socket.on('text', function(text){
		if (!bigrams) console.log("no bigrams");
		if (!unigrams) console.log("no unigrams");
		var score = languagemodel.calculateScore(text, bigrams, unigrams);
		socket.emit("score", score);
	});

});





