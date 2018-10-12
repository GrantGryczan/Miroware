"use strict";
const input = document.body.querySelector("#input");
const output = document.body.querySelector("#output");
const depthInput = document.body.querySelector("#depthInput");
const splitInput = document.body.querySelector("#splitInput");
output.addEventListener("focus", output.select.bind(output));
document.body.querySelector("#help").addEventListener("click", () => {
	new Miro.Dialog("Help", html`
		<p>The memory depth determines how many phrases Mimic is able to remember at a time. 1 is the minimum, causing the least powerful setting of pattern recognition, only ever allowing Mimic to remember 1 previous phrase while putting together output text. More depth means somewhat more similarity to the original input.</p>
		<p>The split expression is a regular expression used to split input text into what defines a phrase. "([^\\w])" is the default, which basically splits between words, numbers, and punctuation. If you empty the split expression box completely, it will split on all characters, allowing for the composition of gibberish words that don't exist. Other than that, don't worry about this setting if you don't know how it works.</p>
	`);
});
const truthy = item => item;
const _phrases = Symbol("phrases");
const _value = Symbol("value");
const start = () => {
	let splitTest;
	try {
		splitTest = new RegExp(splitInput.value);
	} catch(err) {
		new Miro.Dialog("Error", "The split expression must be a valid JavaScript regular expression.");
		return;
	}
	const depth = depthInput.value >= 1 ? parseInt(depthInput.value) : 1;
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
document.body.querySelector("#start").addEventListener("click", start);
