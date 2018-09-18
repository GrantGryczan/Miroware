"use strict";
const input = document.querySelector("#input");
const output = document.querySelector("#output");
output.addEventListener("focus", output.select.bind(output));
const splitTest = /([^\w])/;
const truthy = item => item;
const randomItem = array => array[Math.floor(Math.random() * array.length)];
const start = () => {
	const values = input.value.split(splitTest).filter(truthy);
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
	let phrase = "\n";
	while(true) {
		phrase = randomItem(dictAfter[phrase]);
		if(phrase) {
			string += phrase;
		} else {
			break;
		}
	}
	output.value = string;
};
document.querySelector("#start").addEventListener("click", start);
