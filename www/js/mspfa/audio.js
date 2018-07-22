(() => {
	const rules = [];
	let ready = false;
	const slide = () => {
		for(const rule of rules) {
			if(MSPFA.p >= rule[0] && MSPFA.p <= rule[1]) {
				if(rule[2].paused) {
					rule[2].play();
				}
			} else if(!rule[2].paused) {
				rule[2].pause();
				rule[2].currentTime = 0;
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
	const ruleTest = /@mspfa audio (\d+) (\d+) (.+?)(?:;|\n|$)/g;
	let ruleMatch;
	while(ruleMatch = ruleTest.exec(MSPFA.story.y)) {
		const audio = new Audio(ruleMatch[3]);
		audio.loop = true;
		audio.addEventListener("canplay", load);
		audio.addEventListener("error", error);
		rules.push([parseInt(ruleMatch[1]) || 1, parseInt(ruleMatch[2]) || Infinity, audio]);
	}
	MSPFA.slide.push(slide);
})();
