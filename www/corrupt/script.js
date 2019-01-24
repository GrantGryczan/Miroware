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
const load = () => {
	output.src = "";
	Miro.formState(corruption, false);
	const corrupted = new Uint8Array(array);
	for(let i = Math.max(1, factor.value); i >= 0; i--) {
		corrupted[Math.floor(Math.random() * corrupted.length)] = Math.floor(Math.random() * 256);
	}
	const reader = new FileReader();
	reader.addEventListener("loadend", () => {
		output.src = reader.result;
	});
	reader.readAsDataURL(new Blob([corrupted], {
		type: file.type
	}));
};
output.addEventListener("error", load);
const finish = () => {
	Miro.formState(corruption, true);
	Miro.progress.close();
};
output.addEventListener("load", () => {
	download.disabled = false;
	finish();
});
const timeOut = () => {
	output.src = "";
	new Miro.Dialog("Error", "The corruption took too long to load. Try again, perhaps with a lower corruption factor.");
	finish();
};
corruption.addEventListener("submit", evt => {
	evt.preventDefault();
	Miro.progress.open();
	download.disabled = true;
	load();
	setTimeout(timeOut, 5000);
});
download.addEventListener("click", () => {
	html`<a href="$${output.src}" download="$${file.name}"></a>`.click();
});
document.body.querySelector("#upload").addEventListener("click", fileInput.click.bind(fileInput));
