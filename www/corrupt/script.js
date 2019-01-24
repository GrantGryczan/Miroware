"use strict";
const factor = document.body.querySelector("#factor");
const corruption = document.body.querySelector("#corruption");
const corrupt = corruption.querySelector("#corrupt");
const download = document.body.querySelector("#download");
const input = document.body.querySelector("#input > img");
const output = document.body.querySelector("#output > img");
let file;
let array;
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "image/*";
fileInput.addEventListener("change", () => {
	input.src = URL.createObjectURL(file = fileInput.files[0]);
	fileInput.value = null;
	const reader = new FileReader();
	reader.addEventListener("loadend", () => {
		array = new Uint8Array(reader.result);
		corrupt.disabled = false;
	});
	reader.readAsArrayBuffer(file);
});
corruption.addEventListener("submit", evt => {
	evt.preventDefault();
	const corrupted = new Uint8Array(array);
	for(let i = Math.max(1, factor.value); i >= 0; i--) {
		corrupted[Math.floor(Math.random() * corrupted.length)] = Math.floor(Math.random() * 256);
	}
	output.src = URL.createObjectURL(new Blob([corrupted], {
		type: file.type
	}));
	download.disabled = false;
});
download.addEventListener("click", () => {
	html`<a href="$${output.src}" download="$${file.name}"></a>`.click();
});
document.body.querySelector("#upload").addEventListener("click", fileInput.click.bind(fileInput));
