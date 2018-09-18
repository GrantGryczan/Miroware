"use strict";
const input = document.querySelector("#input");
const output = document.querySelector("#output");
output.addEventListener("focus", output.select.bind(output));
const splitTest = /([^\w])/;
const truthy = item => item;
const start = () => {
	const values = [...input.value.split(splitTest).filter(truthy), false];
	const dictAfter = {};
	for(let i = 0; i < values.length - 1; i++) {
		const value = values[i];
		if(!dictAfter[value]) {
			dictAfter[value] = [];
		}
		dictAfter[value].push(values[i + 1]);
	}
	let string = "";
	let phrase = values[0];
	do {
		string += phrase;
		const after = dictAfter[phrase];
		phrase = after[Math.floor(Math.random() * after.length)];
	} while(phrase);
	output.value = string;
};
document.querySelector("#start").addEventListener("click", start);
