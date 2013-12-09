// -------------GAME INFO---------------------------
var filename = "hamlet.txt";
var unigramsfile = "unigrams.json"
var bigramsfile = "bigrams.json"

var metaphone = require('./metaphone');
var languagemodel = require('./languagemodel');
var fs = require('fs');



// Functio to lowercase incoming text, get rid of apostrophes and brackets, 
// and split by nonalphabetic characters
function processintoArray(lines) {
	var text = lines.toLowerCase().replace(/['\[\]]/g,"").split(/[^A-z]+/); 
	return text;
}

function getJSON(file, callback) {
	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			console.log("Readfile error: "+err);
		}
		else {
			try {
				var parsedData = JSON.parse(data);
				if (callback && typeof(callback) === "function") {
					callback(parsedData);
				}
				return parsedData;
			}
			catch (ex) {
				console.log(ex);
			}
		}
	});
}


fs.exists(unigramsfile, function(exists) {
	if (exists) {
		unigrams = getJSON(unigramsfile, function (data) {
			console.log("Unigrams loaded from "+unigramsfile);
		});
	} 
	else {
	unigrams = languagemodel.makeUnigrams(filename, unigramsfile);
	}
});

fs.exists(bigramsfile, function(exists) {
	if (exists) {
		bigrams = getJSON(bigramsfile, function (data) {
			console.log("Bigrams loaded from "+bigramsfile);
		});
	} 
	else {
	bigrams = languagemodel.makeBigrams(filename, bigramsfile);
	}
});
	



// ----------------SERVER----------------------------
// var http = require('http')
//   , express = require('express')
//   , app = express()
//   , port = process.env.PORT || 5000;
//   // get port from environmental variable, as is the Heroku way

// app.use(express.static(__dirname + '/public'));

// var server = http.createServer(app);
// server.listen(port, function() { console.log(this._connectionKey)});

// console.log('http server listening on %d', port);

// // Create a Socket.IO instance, passing it our server
// var io = require('socket.io').listen(server);
// io.set('log level', 1);

// // Add a connect listener
// io.sockets.on('connection', function(socket){ 

// 	socket.on('message',function(event){ 
// 		console.log('Message: ',event);
// 	});

// 	socket.on('text', function(text){
// 		var textArray = processintoArray(text);
// 		var score = calculateScore(text.length, checkProbability(text, bigrams, unigrams));
// 		score = 
// 		socket.emit("score", score);
// 	});

// });





