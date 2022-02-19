"use strict";
const input = document.body.querySelector("#input");
const output = document.body.querySelector("#output");
output.addEventListener("focus", output.select.bind(output));
document.body.querySelector("#convert").addEventListener("click", () => {
	output.value = input.value.replace(/pipe\.miroware\.io\/([0-9a-f]{24})/g, (match, hex) => `file.garden/${btoa(hex.match(/\w{2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join("")).replace(/\//g, "-").replace(/\+/g, "_")}`);
});
