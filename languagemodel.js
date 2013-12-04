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
	for (var i = 0; i<choppedtext.length; i++) {
		if (choppedtext[i] in dict){
			dict[choppedtext[i]] += 1;
		}
		else {
			dict[choppedtext[i]] = 1;
		}
	}

	var highestscore = 0;
	for (var word in dict) {
		var count = dict[word];
		var unlikeliness = (-1)*(Math.log(count/choppedtext.length));
		//storing the numbers as "negative probabilities" helps by 1) ensuring no numbers too small for floats, and 2) allowing us to add them instead of multiplying
		dict[word] = unlikeliness;
		if (unlikeliness > highestscore) {
			dict["LEAST_COMMON_PROB"] = unlikeliness;
		}
		//dict stores the highest unlikeliness, which can be assigned to words that aren't recognized at all
	}

	fs.writeFile(unigramsfile, JSON.stringify(dict, null, 4), function(err) {
		if(err) {
			console.log(err);
		}
		else {
			console.log("Unigrams saved to "+unigramsfile);
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