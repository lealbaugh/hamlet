// _Hamlet Language Model_

// go through the source text:
// 	take note of all the words and quantity of each

// Unigrams:
// 	for word in hamlet:
// 		dict[word] +=1


// Bigrams:
// 	prev = START
// 	for word in hamlet:
// 		dict[prev][word] +=1
// 		prev=word

// 		(can do start on a line-by-line or overall basis)

// Then go through and divide the counts by the total word count

// 		then store probabilities as "negative log probs" (aka "unlikeliness values," absolute value of logarithm base two of tiny probability numbers), therefore they can be added instead of multiplied at the sentence evaluation level
// // ----------------------------------


var fs = require('fs');
var filename = "hamlet.txt";
var unigramsfile = "unigrams.json"


function makeArray(lines) {
// lowercase it, get rid of apostrophes, and split by nonalphabetic characters
	var choppedtext = lines.toLowerCase().replace(/[']/g,"").split(/[^A-z]+/); 
	return choppedtext;
}

function makeUnigrams(choppedtext) {
	var dict = {};
	for (var i = 0; i<choppedtext.length; i++) {
		if (choppedtext[i] in dict){
			dict[choppedtext[i]] += 1;
		}
		else {
			dict[choppedtext[i]] = 1;
		}
	}
	for (var i = 0; i<choppedtext.length; i++) {
		count = dict[choppedtext[i]];
		unlikeliness = (-1)*(Math.log(count/choppedtext.length));
		//storing the numbers as "negative probabilities" helps by 1) ensuring no numbers too small for floats, and 2) allowing us to add them instead of multiplying
		dict[choppedtext[i]] = unlikeliness;
	}

	fs.writeFile(unigramsfile, JSON.stringify(dict, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved to "+unigramsfile);
	    }
	}); 
}

var main = function() {
	fs.readFile(filename,'utf8', function (err, data) {
		console.log("file read in!");
		var choppedtext = makeArray(data);
		makeUnigrams(choppedtext);
	});
}

main();