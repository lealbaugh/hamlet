
function main() {
	init();
}

function init() {
	
	var textarea = document.createElement('textarea');
	textarea.setAttribute("id", "textarea");
	document.querySelector('body').appendChild(textarea);

	var scorearea = document.createElement('div');
	scorearea.setAttribute("id", "scorearea");
	document.querySelector('body').appendChild(scorearea);


	window.addEventListener("keypress", function(e){ 
		// if the key is return, space, or tab
		if(e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 9){
			var text = document.getElementById('textarea').value;
			post(text);
		}
	});

	ws = io.connect()
	ws.on('score', function(score){
		document.getElementById('scorearea').innerHTML = score;
		console.log("posted score: "+score);
	});

}

function post(text) {
	ws.emit("text", text);
	console.log("emitting text: "+text);
}

main();
