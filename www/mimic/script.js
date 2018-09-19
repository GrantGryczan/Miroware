"use strict";
const input = document.querySelector("#input");
const output = document.querySelector("#output");
const depthInput = document.querySelector("#depthInput");
const splitExp = document.querySelector("#splitExp");
output.addEventListener("focus", output.select.bind(output));
const truthy = item => item;
const _phrases = Symbol("phrases");
const _value = Symbol("value");
const start = () => {
	let splitTest;
	try {
		splitTest = new RegExp(splitExp.value);
	} catch(err) {
		new Miro.Dialog("Error", "The split expression must be a valid regular expression.");
		return;
	}
	const depth = +depthInput.value || 1;
	const items = input.value.split(splitTest).filter(truthy);
	if(!items.length) {
		output.value = "";
		return;
	}
	if(items[0] !== "\n") {
		items.unshift("\n");
	}
	if(items[items.length - 1] !== "\n") {
		items.push("\n");
	}
	for(let i = 0; i < depth; i++) {
		items.unshift("");
		items.push("");
	}
	const dictionary = {};
	for(let i = 0; i < items.length; i++) {
		const item = items[i];
		let entry = dictionary[item];
		if(!entry) {
			entry = dictionary[item] = {
				[_phrases]: []
			};
		}
		for(let j = 1; j <= depth; j++) {
			const phrase = items[i + j] || "";
			entry[_phrases].push(phrase);
			if(!entry[phrase]) {
				entry[phrase] = {
					[_phrases]: [],
					[_value]: 0
				};
			}
			(entry = entry[phrase])[_value]++;
		}
	}
	let string = "";
	while(!string) {
		let phrase = "\n";
		loop: while(true) {
			let chance = 1;
			let entry = dictionary[phrase];
			for(let i = 1; i <= depth && Math.random() < chance; i++) {
				const prevPhrase = phrase;
				const entryPhrases = entry[_phrases];
				phrase = entryPhrases[Math.floor(Math.random() * entryPhrases.length)];
				if(phrase) {
					string += phrase;
					const dictionaryPhrase = dictionary[prevPhrase]
					chance = dictionaryPhrase[phrase][_value] / dictionaryPhrase[_phrases].length;
					entry = entry[phrase];
				} else {
					break loop;
				}
			}
		}
	}
	output.value = string;
};
document.querySelector("#start").addEventListener("click", start);
