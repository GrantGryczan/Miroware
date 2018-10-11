"use strict";
const addFile = file => {
	const {xhr} = Miro.request("POST", "/users/@me/pipe", {
		"Content-Type": "application/octet-stream"
	}, file).then(Miro.response(console.log));
	xhr.upload.addEventListener("progress", console.log);
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
