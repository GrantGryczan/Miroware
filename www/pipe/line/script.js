"use strict";
const captchaCallbacks = [];
window.captchaCallback = response => {
	while(captchaCallbacks.length) {
		captchaCallbacks.shift()(response);
	}
};
const executeCaptcha = resolve => {
	const response = grecaptcha.getResponse();
	if(response) {
		resolve(response);
	} else if(captchaCallbacks.push(resolve) === 1) {
		grecaptcha.execute();
	}
};
const addFile = file => {
	console.log(file);
	Miro.request("POST", "/users/@me/pipe", {}, {
		name: file.name
	}).then(Miro.response(async xhr => {
		console.log(xhr.response);
		Miro.request("PUT", `/users/@me/pipe/${xhr.response.id}/data`, {
			"Content-Type": "application/octet-stream",
			"X-Captcha": await new Promise(executeCaptcha)
		}, file, xhr => {
			xhr.upload.addEventListener("progress", console.log);
		}).then(Miro.response(console.log));
	}));
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
