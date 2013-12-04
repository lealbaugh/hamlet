// _Hamlet Language Model_
// ----------------------------------
var fs = require('fs');
var filename = "hamlet.txt";
var unigramsfile = "unigrams.json"
var bigramsfile = "bigrams.json"


function processintoArray(lines) {
// lowercase it, get rid of apostrophes, and split by nonalphabetic characters
	var text = lines.toLowerCase().replace(/[']/g,"").split(/[^A-z]+/); 
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



var main = function() {
	fs.readFile(filename,'utf8', function (err, data) {
		console.log("File read in:", filename);
		var text = processintoArray(data);
		makeBigrams(text, bigramsfile);
		makeUnigrams(text, unigramsfile);
	});
}

main();