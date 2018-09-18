"use strict";
const input = document.querySelector("#input");
const output = document.querySelector("#output");
const splitExp = document.querySelector("#splitExp");
output.addEventListener("focus", output.select.bind(output));
const truthy = item => item;
const randomItem = array => array[Math.floor(Math.random() * array.length)];
const start = () => {
	let splitTest;
	try {
		splitTest = new RegExp(splitExp.value);
	} catch(err) {
		new Miro.Dialog("Error", "The split expression must be a valid regular expression.");
		return;
	}
	const values = input.value.split(splitTest).filter(truthy);
	if(!values.length) {
		output.value = "";
		return;
	}
	if(values[0] !== "\n") {
		values.unshift("\n");
	}
	if(values[values.length - 1] !== "\n") {
		values.push("\n");
	}
	const dictAfter = {};
	for(let i = 0; i < values.length; i++) {
		const value = values[i];
		if(!dictAfter[value]) {
			dictAfter[value] = [];
		}
		dictAfter[value].push(values[i + 1]);
	}
	let string = "";
	while(!string) {
		let phrase = "\n";
		while(true) {
			phrase = randomItem(dictAfter[phrase]);
			if(phrase) {
				string += phrase;
			} else {
				break;
			}
		}
	}
	output.value = string;
};
document.querySelector("#start").addEventListener("click", start);
