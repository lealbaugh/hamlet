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
	while (word.match(/([^c])\1/)) {
		word = word.replace(/([^c])\1/, "\$1");
	}
		
// If the word begins with 'KN', 'GN', 'PN', 'AE', 'WR', drop the first letter.
	if (word.match(/\bkn|\bgn|\bpn|\bae|\bwr/)) {
		word = word.substring(1);
	}

// Drop 'B' if after 'M' at the end of the word.
	if (word.match(/mb\b/)) {
		word = word.substring(0, word.length-1);
	}

// 'C' transforms to 'X' if followed by 'IA' or 'H' (unless in latter case, it is part of '-SCH-', in which case it transforms to 'K'). 'C' transforms to 'S' if followed by 'I', 'E', or 'Y'. Otherwise, 'C' transforms to 'K'.
	while (word.match(/sch/)) {
		word = word.replace(/sch/, "skh","g");
	}
	while (word.match(/c(?=(ia|h))/)) {
		word = word.replace(/c(?=(ia|h))/, "x","g");
	}
	while (word.match(/c(?=(i|e|y))/)) {
		word = word.replace(/c(?=(i|e|y))/, "s","g");
	}
	while (word.match(/c/)) {
		word = word.replace(/c/, "k","g");
	}

// Drop 'G' if followed by 'H' and 'H' is not at the end or before a vowel. Drop 'G' if followed by 'N' or 'NED' and is at the end.
	while (word.match(/g(h[^aeiou\b])/)) {
		word = word.replace(/g(h[^aeiou\b])/, "\$1","g");
	}
	while (word.match(/g((n|ned)\b)/)) {
		word = word.replace(/g((n|ned)\b)/, "\$1","g");
	}

// 'D' transforms to 'J' if followed by 'GE', 'GY', or 'GI'. Otherwise, 'D' transforms to 'T'.
//moved this under the previous one because otherwise 'ned' would never be achieved
	while (word.match(/j(?=(ge|gy|gi))/)) {
		word = word.replace(/j(?=(ge|gy|gi))/, "j","g");
	}
	while (word.match(/d/)) {
		word = word.replace(/d/, "t","g");
	}

// 'G' transforms to 'J' if before 'I', 'E', or 'Y', and it is not in 'GG'. Otherwise, 'G' transforms to 'K'.
//why would there still be "gg"? we got rid of double letters.
	while (word.match(/g(?=i|e|y)/)) {
		word = word.replace(/g(?=i|e|y)/, "j","g");
	}
	while (word.match(/g/)) {
		word = word.replace(/g/,"k","g");
	}

// Drop 'H' if after vowel and not before a vowel.
	while (word.match(/[aeiou]h([^aeiou]|\b)/)) {
		word=word.replace(/([aeiou])h([^aeiou]|\b)/, "\$1\$2");
	}

// 'CK' transforms to 'K'.
	while (word.match(/(ck)/)) {
		word=word.replace(/(ck)/, "k");
	}

// 'PH' transforms to 'F'.
	while (word.match(/(ph)/)) {
		word=word.replace(/(ph)/, "f");
	}

// 'Q' transforms to 'K'.
	while (word.match(/(q)/)) {
		word=word.replace(/(q)/, "k");
	}

// 'S' transforms to 'X' if followed by 'H', 'IO', or 'IA'.
	while (word.match(/s(?=h|io|ia)/)) {
		word = word.replace(/s(?=h|io|ia)/, "x");
	}

// 'T' transforms to 'X' if followed by 'IA' or 'IO'. 'TH' transforms to '0'. Drop 'T' if followed by 'CH'.
	while (word.match(/t(?=io|ia)/)) {
		word = word.replace(/t(?=io|ia)/, "x");
	}
	while (word.match(/t(?=ch)/)) {
		word = word.replace(/t(?=ch)/, "");
	}
	while (word.match(/th/)) {
		word = word.replace(/th/, "0");
	}


// 'V' transforms to 'F'.
	while (word.match(/(v)/)) {
		word=word.replace(/(v)/, "f")
	}

// 'WH' transforms to 'W' if at the beginning. Drop 'W' if not followed by a vowel.
	word = word.replace(/\bwh/,'w');
	while (word.match(/w(?=[aeiou]])/)) {
			word = word.replace(/w(?=[aeiou]])/, "");
		}

// 'X' transforms to 'S' if at the beginning. Otherwise, 'X' transforms to 'KS'.
	if (word.match(/\bx/)) {
		word = "s"+word.substring(1);
	}
	while (word.match(/(x)/)) {
		word=word.replace(/(x)/, "ks");
	}

// Drop 'Y' if not followed by a vowel.
	while (word.match(/y(?![aieou])/)) {
		word = word.replace(/y(?![aieou])/, "", "g");
		
	}

// 'Z' transforms to 'S'.
	while (word.match(/(z)/)) {
		word=word.replace(/(z)/, "s");
	}

// Drop all vowels unless it is the beginning.
	while (word.match(/(.)[aeiou](.*)/)) {
		word = word.replace(/(.)[aeiou](.*)/, "\$1\$2", "g");
		
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
	// console.log(choppedtext);
	for (var i = 0; i<choppedtext.length; i++) {
		choppedtext[i] = metaphone(choppedtext[i]);
	}
	var output = choppedtext.join(" ");
	if (output.match(/[^bxskjtfhlmnpr0wyaeiou\s]/)) console.log("character warning!");
	console.log(output);
}

main();