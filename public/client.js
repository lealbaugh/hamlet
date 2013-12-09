
function main() {
	init();
}

function init() {
	
	var textarea = document.createElement('textarea');
	textarea.setAttribute("id", "textarea");
	textarea.setAttribute("autofocus", "true");
	// textarea.setAttribute("placeholder", "Type..");
	document.querySelector('body').appendChild(textarea);

	var scorearea = document.createElement('div');
	scorearea.setAttribute("id", "scorearea");
	document.querySelector('body').appendChild(scorearea);

	var score = document.createElement('div');
	score.setAttribute("id", "score");
	score.innerHTML = "O";
	document.querySelector('#scorearea').appendChild(score);

	var bananas = document.createElement('div');
	bananas.setAttribute("id", "bananas");
	bananas.innerHTML = " x <img src=\"banana_icon.png\">";
	document.querySelector('#scorearea').appendChild(bananas);


	window.addEventListener("keypress", function(e){ 
		// if the key is return, space, or tab
		if(e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 9){
			var text = document.getElementById('textarea').value;
			post(text);
		}
	});

	ws = io.connect()
	ws.on('score', function(score){
		document.getElementById('score').innerHTML = score;
		console.log("posted score: "+score);
	});

}

function post(text) {
	ws.emit("text", text);
	console.log("emitting text: "+text);
}

main();
