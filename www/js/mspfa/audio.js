(function() {
	var ruleData = [];
	var ready = false;
	var slide = function() {
		for(var i = 0; i < ruleData.length; i++) {
			if(p >= ruleData[i][0] && p <= ruleData[i][1]) {
				if(ruleData[i][2].paused) {
					ruleData[i][2].play();
				}
			} else if(!ruleData[i][2].paused) {
				ruleData[i][2].pause();
				ruleData[i][2].currentTime = 0;
			}
		}
	};
	var loaded = 0;
	var load = function() {
		if(++loaded === ruleData.length) {
			ready = true;
			slide();
		}
	};
	var error = function(evt) {
		var message = document.createElement("span");
		message.appendChild(document.createTextNode("Audio failed to load:"));
		message.appendChild(document.createElement("br"));
		var audioLink = document.createElement("a");
		audioLink.textContent = audioLink.href = evt.target.src;
		audioLink.target = "_blank";
		message.appendChild(audioLink);
		MSPFA.dialog("Error", message, ["Okay"]);
		load();
	};
	var ruleTest = /@mspfa audio (\d+) (\d+) (.+?)(?:;|\n|$)/g;
	var ruleMatch;
	while(ruleMatch = ruleTest.exec(MSPFA.story.y)) {
		var audio = new Audio(ruleMatch[3]);
		audio.addEventListener("load", load);
		audio.addEventListener("error", error);
		ruleData.push([parseInt(ruleMatch[1]) || 1, parseInt(ruleMatch[2]) || Infinity, audio]);
	}
	MSPFA.slide.push(function(page) {
		p = page;
		slide();
	});
})();
