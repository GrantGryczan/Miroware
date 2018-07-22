(() => {
	const rules = [];
	let ready = false;
	const slide = () => {
		for(const rule of rules) {
			if(MSPFA.p >= rule[0] && MSPFA.p <= rule[1]) {
				rule[3].volume = rule[2];
				if(rule[3].paused) {
					rule[3].play();
				}
				rule[3]._pause = false;
			} else if(!rule[3].paused) {
				rule[3]._pause = true;
			}
		}
		for(const rule of rules) {
			if(rule[3]._pause) {
				rule[3].pause();
				rule[3].currentTime = 0;
				delete rule[3]._pause;
			}
		}
	};
	let loaded = 0;
	const load = () => {
		if(++loaded === rules.length) {
			ready = true;
			slide();
		}
	};
	const error = evt => {
		const message = document.createElement("span");
		message.appendChild(document.createTextNode("Audio failed to load:"));
		message.appendChild(document.createElement("br"));
		const audioLink = document.createElement("a");
		audioLink.textContent = audioLink.href = evt.target.src;
		audioLink.target = "_blank";
		message.appendChild(audioLink);
		MSPFA.dialog("Error", message, ["Okay"]);
		load();
	};
	const ruleTest = /@mspfa audio(?: (\d+))?(?: (\d+))?(?: ([\d\.]+))? (.+?)(?:;|\n|$)/g;
	let ruleMatch;
	while(ruleMatch = ruleTest.exec(MSPFA.story.y)) {
		const audio = new Audio(ruleMatch[4]);
		audio.loop = true;
		audio.addEventListener("canplay", load);
		audio.addEventListener("error", error);
		const minPage = parseInt(ruleMatch[1]) || 1;
		rules.push([minPage, ruleMatch[2] ? parseInt(ruleMatch[2]) || Infinity : (ruleMatch[1] ? minPage : Infinity), Number(ruleMatch[3]) || 1, audio]);
	}
	MSPFA.slide.push(slide);
})();
