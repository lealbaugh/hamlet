// _Hamlet Language Model_
// ----------------------------------
var fs = require('fs');
var filename = "hamlet.txt";
var unigramsfile = "unigrams.json"
var bigramsfile = "bigrams.json"

var bigrams = {};
var unigrams = {};

var metaphone = require('./metaphone');


function processintoArray(lines) {
// lowercase it, get rid of apostrophes and brackets, and split by nonalphabetic characters
	var text = lines.toLowerCase().replace(/['\[\]]/g,"").split(/[^A-z]+/); 
	return text;
}

// Make unigram probabilities out of an array of words; output them to the given file.
function makeUnigrams(text, outputfile) {
	var dict = {};
	var highestscore = 0;
	// count the occurences of each word
	for (var i = 0; i<text.length; i++) {
		if (text[i] in dict){
			dict[text[i]] += 1;
		}
		else {
			dict[text[i]] = 1;
		}
	}
	// then use that count to calculate the probability of each word
	for (var word in dict) {
		var count = dict[word];
		var unlikeliness = (-1)*(Math.log(count/text.length));
		//storing the numbers as "negative logarithmic probabilities" helps by 1) ensuring no numbers too small for floats, and 2) allowing us to add them instead of multiplying
		dict[word] = unlikeliness;
		if (unlikeliness > highestscore) {
			dict["LEAST_COMMON_PROB"] = unlikeliness;
		}
		// dict also stores the highest unlikeliness, which can be assigned to words that aren't recognized at all
	}
	// store it in a higher-scoped object, for now
	unigrams = dict;
	// and write it to the external file
	fs.writeFile(outputfile, JSON.stringify(dict, null, 4), function(err) {
		if(err) {
			console.log(err);
		}
		else {
			console.log("Unigrams saved to "+outputfile);
		}
	}); 
}

// Make bigram probabilities out of an array of words; output them to the given file.
function makeBigrams(text, outputfile) {
	var dict = {};
	var prev = text[0];
	// count the occurences of each word
	for (var i = 1; i<text.length; i++) {
		
		if (!(prev in dict)) {
			dict[prev] = {};
		}
		if (text[i] in dict[prev]){
			dict[prev][text[i]] += 1;
		}
		else {
			dict[prev][text[i]] = 1;
		}
		prev = text[i];
	}
	for (var firstword in dict) {
		//count up all the instances of the first word, so we can divide by it
		var totalinstances = 0;
		for (var item in dict[firstword]) {
			totalinstances += dict[firstword][item];
		}
		// then use that count to calculate the probability of each word
		for (var secondword in dict[firstword]) {
			var count = dict[firstword][secondword];
			var unlikeliness = (-1)*(Math.log(count/totalinstances));
			//see above on negative logprobs
			if (unlikeliness == 0) {
				unlikeliness = 0.01;
			}
			// give it *something* to tally
			dict[firstword][secondword] = unlikeliness;
			// we don't store the least-common prob here, because if the bigram fails, we drop down to unigrams. 
		}	
	}
	// store it in a higher-scoped object, for now
	bigrams = dict;
	// and write 'em all out to the external file
	fs.writeFile(outputfile, JSON.stringify(dict, null, 4), function(err) {
		if(err) {
			console.log(err);
		}
		else {
			console.log("Bigrams saved to "+outputfile);
		}
	}); 
}

function metaphoneText(text) {
	metaphonedText = [];
	for (var i = 0; i<text.length; i++) {
			metaphonedText[i] = metaphone(text[i]);
		}
	return metaphonedText;
}


function checkProbability(text, bigrams, unigrams) {
	var prev = text[0];
	var value = 0;
	// if we have at least two words, we can check the bigrams
	if (text.length > 1){
		for (var i = 1; i<text.length; i++) {
			current = text[i];
			if(prev in bigrams && current in bigrams[prev]) {
				value += bigrams[prev][current];
			}
			else if (current in unigrams) {
				value += unigrams[current]+0.91629;
				// "stupid backoff" is we multiply the (n-1)grams value by 0.4
				// aka add the neglog of 0.4, which is 0.91629
			}
			else {
				value += unigrams["LEAST_COMMON_PROB"]+0.91629;
				// and if it doesn't exist there, call it as common as the least comnon thing
			}		
			prev = current;
		}	
	}
	// otherwise, we can only check the word as a unigram
	else if (text.length > 0) {
		if (prev in unigrams) {
			value += unigrams[prev]+0.91629;
			// "stupid backoff" is we multiply the (n-1)grams value by 0.4
			// aka add the neglog of 0.4, which is 0.91629
		}
		else {
			value += unigrams["LEAST_COMMON_PROB"]+0.91629;
			// and if it doesn't exist there, call it as common as the least comnon thing
		}
	}
	// otherwise, the value stays at 0, but then so does the text.length
	var score;
	if (text.length < 1) {
		score = 0;
	}
	// longer strings with smaller "values" are worth more points
	else {
		var avgValue = value/text.length //going to be somewhere between 0 and 11.2
		score = Math.round(10*(11.5 - avgValue)*text.length);		
	}
	
	console.log("Text: "+text.join(" ")
		+"\nvalue: "+value
		+"\nscore: "+score
		+"\n------------------")
}

// ----------------------------------MAIN--------------------------------------------
var main = function() {
	fs.readFile(filename,'utf8', function (err, data) {
		console.log("File read in:", filename);
		var text = processintoArray(data);
		// var metaphonedText = metaphoneText(text);
		makeBigrams(text, bigramsfile);
		makeUnigrams(text, unigramsfile);
		// makeBigrams(metaphonedText, "meta-bigrams.json");
		// makeUnigrams(metaphonedText, "meta-unigrams.json");
		checkProbability(processintoArray("whether tis nobler in the mind to suffer the slings and arrows of outrageous fortune"), bigrams, unigrams);
		checkProbability(processintoArray("fourscore and seven years ago"), bigrams, unigrams);
		checkProbability(processintoArray("strumpet"), bigrams, unigrams);
		checkProbability(processintoArray("your orisons"), bigrams, unigrams);
		checkProbability(processintoArray("let's all go to elsinore"), bigrams, unigrams);
		checkProbability(processintoArray("let's all go to switzerland"), bigrams, unigrams);
		checkProbability(processintoArray("let's all go to"), bigrams, unigrams);
		checkProbability(processintoArray("to be or not to be or not to be or not to be or not to be or not to be or not to be or not to be or not to be or not to be or not to be or not to be or not to be"), bigrams, unigrams);
		checkProbability(processintoArray("call me ahab"), bigrams, unigrams);
		checkProbability(processintoArray("call me maybe"), bigrams, unigrams);

	});
}

main();