"use strict";
const addFile = file => {
	/*const reader = new FileReader();
	reader.addEventListener("progress", console.log);
	reader.addEventListener("loadend", console.log);
	reader.readAsArrayBuffer(file);*/
	Miro.request("POST", "/users/@me/pipe", {
		"Content-Type": "application/octet-stream"
	}, file);
};
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.multiple = true;
fileInput.addEventListener("change", () => {
	Array.prototype.forEach.call(fileInput.files, addFile);
	fileInput.value = null;
});
const uploadButton = document.querySelector("#uploadButton");
uploadButton.addEventListener("click", fileInput.click.bind(fileInput));
