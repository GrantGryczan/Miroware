"use strict";
(() => {
	const rules = [];
	let audioValues;
	const slide = () => {
		for (const rule of rules) {
			if (MSPFA.p >= rule[0] && MSPFA.p <= rule[1]) {
				rule[3].volume = rule[2];
				if (rule[3].paused) {
					rule[3].play();
				}
				rule[3]._pause = false;
			} else if (!rule[3].paused && rule[3]._pause === undefined) {
				rule[3]._pause = true;
			}
		}
		for (const audio of audioValues) {
			if (audio._pause) {
				audio.pause();
				audio.currentTime = 0;
			}
			delete audio._pause;
		}
	};
	let loaded = 0;
	const load = () => {
		if (++loaded === rules.length) {
			audioValues = Object.values(audios);
			MSPFA.slide.push(slide);
			slide();
		}
	};
	const error = evt => {
		const message = document.createElement("span");
		message.appendChild(document.createTextNode("No audio file was found at the following URL:"));
		message.appendChild(document.createElement("br"));
		const audioLink = document.createElement("a");
		audioLink.textContent = audioLink.href = evt.target.src;
		audioLink.target = "_blank";
		message.appendChild(audioLink);
		MSPFA.dialog("Error", message, ["Okay"]);
		load();
	};
	const audios = {};
	const ruleTest = /@mspfa audio(?: (\d+))?(?: (\d+))?(?: ([\d\.]+))? (.+?)(?:;|\n|$)/g;
	let ruleMatch;
	while (ruleMatch = ruleTest.exec(MSPFA.story.y)) {
		if (audios[ruleMatch[4]]) {
			load();
		} else {
			audios[ruleMatch[4]] = new Audio(ruleMatch[4]);
			audios[ruleMatch[4]].loop = true;
			audios[ruleMatch[4]].addEventListener("canplay", load);
			audios[ruleMatch[4]].addEventListener("error", error);
		}
		const minPage = parseInt(ruleMatch[1]) || 1;
		rules.push([minPage, ruleMatch[2] ? parseInt(ruleMatch[2]) || Infinity : (ruleMatch[1] ? minPage : Infinity), Number(ruleMatch[3]) || 1, audios[ruleMatch[4]]]);
	}
})();
