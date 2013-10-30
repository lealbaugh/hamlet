//Implements simplified Metaphone based on the ruleset at http://en.wikipedia.org/wiki/Metaphone and http://po-ru.com/projects/metaphone/

var fs = require('fs');
var filename = "speech.txt";


var makeArray = function(lines){
// lowercase it, get rid of apostrophes, and split by nonalphabetic characters
	var choppedtext = lines.toLowerCase().replace(/[']/g,"").split(/[^A-z]+/); 
	return choppedtext;
}

var metaphone = function(word){
// Drop duplicate adjacent letters, except for C.
	word = word.replace(/([^c])\1/g, "\$1");
		
// If the word begins with 'KN', 'GN', 'PN', 'AE', 'WR', drop the first letter.
	if (word.match(/\bkn|\bgn|\bpn|\bae|\bwr/)) {
		word = word.substring(1);
	}

// Drop 'B' if after 'M' at the end of the word.
	if (word.match(/mb\b/)) {
		word = word.substring(0, word.length-1);
	}

// 'X' transforms to 'S' if at the beginning. Otherwise, 'X' transforms to 'KS'.
//pulled this above the C transformations so "perchance" is "prxhns" instead of "prkshns"
	if (word.match(/\bx/)) {
		word = "s"+word.substring(1);
	}
	word=word.replace(/(x)/, "ks");

// 'C' transforms to 'X' if followed by 'IA' or 'H' (unless in latter case, it is part of '-SCH-', in which case it transforms to 'K'). 'C' transforms to 'S' if followed by 'I', 'E', or 'Y'. Otherwise, 'C' transforms to 'K'.
	word = word.replace(/sch/g, "skh");
	word = word.replace(/c(?=(ia|h))/g, "x");
	word = word.replace(/c(?=(i|e|y))/g, "s");
	word = word.replace(/c/g, "k");

// Drop 'G' if followed by 'H' and 'H' is not at the end or before a vowel. Drop 'G' if followed by 'N' or 'NED' and is at the end.
	word.replace(/g(h[^aeiou\b])/g, "\$1");
	word = word.replace(/g((n|ned)\b)/g, "\$1");

// 'D' transforms to 'J' if followed by 'GE', 'GY', or 'GI'. Otherwise, 'D' transforms to 'T'.
//moved this under the previous one because otherwise 'ned' would never be achieved
	word = word.replace(/j(?=(ge|gy|gi))/g, "j");
	word = word.replace(/d/g, "t");

// 'G' transforms to 'J' if before 'I', 'E', or 'Y', and it is not in 'GG'. Otherwise, 'G' transforms to 'K'.
//why would there still be "gg"? we got rid of double letters.
	word = word.replace(/g(?=i|e|y)/g, "j");
	word = word.replace(/g/,"k");

// Drop 'H' if after vowel and not before a vowel.
	word=word.replace(/([aeiou])h([^aeiou]|\b)/g, "\$1\$2");

// 'CK' transforms to 'K'.
	word=word.replace(/(ck)/g, "k");

// 'PH' transforms to 'F'.
	word=word.replace(/(ph)/g, "f");

// 'Q' transforms to 'K'.
	word=word.replace(/(q)/g, "k");

// 'S' transforms to 'X' if followed by 'H', 'IO', or 'IA'.
	word = word.replace(/s(?=h|io|ia)/g, "x");

// 'T' transforms to 'X' if followed by 'IA' or 'IO'. 'TH' transforms to '0'. Drop 'T' if followed by 'CH'.
	word = word.replace(/t(?=io|ia)/g, "x");
	word = word.replace(/t(?=ch)/g, "");
	word = word.replace(/th/g, "0");

// 'V' transforms to 'F'.
	word=word.replace(/(v)/, "f");

// 'WH' transforms to 'W' if at the beginning. Drop 'W' if not followed by a vowel.
	word = word.replace(/\bwh/,'w');
	word = word.replace(/w(?=[aeiou]])/, "")


// Drop 'Y' if not followed by a vowel.
	word = word.replace(/y(?![aieou])/g, "", "g");

// 'Z' transforms to 'S'.
	word=word.replace(/(z)/g, "s");

// Drop all vowels unless it is the beginning.
	while (word.match(/(.)[aeiou](.*)/)) {
		word = word.replace(/(.)[aeiou](.*)/g, "\$1\$2");
		
	}

// aaaanndd return
	return word;
}

var disemvowel = function(word) {
	while (word.match(/(.)[aeiou](.*)/)) {
		word = word.replace(/(.)[aeiou](.*)/, "\$1\$2", "g");
		
	}
	return word;
}

var seas = function(word) {
	word = word.replace(/sch/g, "skh");
	word = word.replace(/c(?=(ia|h))/g, "x");
	word = word.replace(/c(?=(i|e|y))/g, "s");
	word = word.replace(/c/g, "k");
	return word;
}

var ampersand = function(lines){
	console.log(lines.split(/[^A-z]+/).join(".").toLowerCase());

}


var main = function() {
	var lines = fs.readFileSync(filename,'utf8');
	var choppedtext = makeArray(lines);
	for (var i = 0; i<choppedtext.length; i++) {
		choppedtext[i] = metaphone(choppedtext[i]);
	}
	var output = choppedtext.join(" ");
	if (output.match(/[^bxskjtfhlmnpr0wyaeiou\s]/)) console.log("character warning!");
	console.log(output);
}

main();