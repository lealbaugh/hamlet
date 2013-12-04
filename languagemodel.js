// _Hamlet Language Model_

// go through the source text:
// 	take note of all the words and quantity of each

// Unigrams:
// 	for word in hamlet:
// 		dict[word] +=1
// Then go through and divide the counts by the total word count

// Bigrams:
// 	prev = START
// 	for word in hamlet:
// 		dict[prev][word] +=1
// 		prev=word

// and likewise divide
// 		(can do start on a line-by-line or overall basis)
// // ----------------------------------


var fs = require('fs');
var filename = "hamlet.txt";
var unigramsfile = "unigrams.json"
var bigramsfile = "bigrams.json"


function makeArray(lines) {
// lowercase it, get rid of apostrophes, and split by nonalphabetic characters
	var choppedtext = lines.toLowerCase().replace(/[']/g,"").split(/[^A-z]+/); 
	return choppedtext;
}


function makeUnigrams(choppedtext) {
	var dict = {};
	var highestscore = 0;
	// count the occurences of each word
	for (var i = 0; i<choppedtext.length; i++) {
		if (choppedtext[i] in dict){
			dict[choppedtext[i]] += 1;
		}
		else {
			dict[choppedtext[i]] = 1;
		}
	}
	// then use that count to calculate the probability of each word
	for (var word in dict) {
		var count = dict[word];
		var unlikeliness = (-1)*(Math.log(count/choppedtext.length));
		//storing the numbers as "negative logarithmic probabilities" helps by 1) ensuring no numbers too small for floats, and 2) allowing us to add them instead of multiplying
		dict[word] = unlikeliness;
		if (unlikeliness > highestscore) {
			dict["LEAST_COMMON_PROB"] = unlikeliness;
		}
		// dict also stores the highest unlikeliness, which can be assigned to words that aren't recognized at all
	}
	// and write it to the external file
	fs.writeFile(unigramsfile, JSON.stringify(dict, null, 4), function(err) {
		if(err) {
			console.log(err);
		}
		else {
			console.log("Unigrams saved to "+unigramsfile);
		}
	}); 
}

function makeBigrams(choppedtext) {
	var dict = {};
	var prev = "scene";
	// count the occurences of each word

	for (var i = 1; i<choppedtext.length; i++) {
		
		if (!(prev in dict)) {
			dict[prev] = {};
		}
		if (choppedtext[i] in dict[prev]){
			// console.log("already there:",prev, choppedtext[i]);
			dict[prev][choppedtext[i]] += 1;
		}
		else {
			// console.log("new:",prev, choppedtext[i]);
			dict[prev][choppedtext[i]] = 1;
		}
		prev = choppedtext[i];
	}

	// then use that count to calculate the probability of each word
	// for (var firstword in dict) {
	// 	var count = dict[word];
	// 	var unlikeliness = (-1)*(Math.log(count/choppedtext.length));
	// 	//storing the numbers as "negative logarithmic probabilities" helps by 1) ensuring no numbers too small for floats, and 2) allowing us to add them instead of multiplying
	// 	dict[word] = unlikeliness;
	// 	if (unlikeliness > highestscore) {
	// 		dict["LEAST_COMMON_PROB"] = unlikeliness;
	// 	}
	// 	// dict also stores the highest unlikeliness, which can be assigned to words that aren't recognized at all
	// }
	// and write it to the external file
	fs.writeFile(bigramsfile, JSON.stringify(dict, null, 4), function(err) {
		if(err) {
			console.log(err);
		}
		else {
			console.log("Bigrams saved to "+bigramsfile);
		}
	}); 
}



var main = function() {
	fs.readFile(filename,'utf8', function (err, data) {
		console.log("file read in!");
		var choppedtext = makeArray(data);
		makeBigrams(choppedtext);
	});
}

main();