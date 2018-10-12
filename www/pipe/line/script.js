"use strict";
const container = document.body.querySelector("#container");
const addFile = file => {
	console.log(file);
	Miro.request("POST", "/users/@me/pipe", {}, {
		name: file.name
	}).then(Miro.response(async xhr => {
		console.log(xhr.response);
		Miro.request("PUT", `/users/@me/pipe/${xhr.response.id}/data`, {
			"Content-Type": "application/octet-stream"
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
const uploadButton = container.querySelector("#uploadButton");
uploadButton.addEventListener("click", fileInput.click.bind(fileInput));
const targetIndicator = document.body.querySelector("#targetIndicator");
const indicateTarget = target => {
	if(target) {
		const rect = target.getBoundingClientRect();
		targetIndicator.style.transform = `translate(${rect.left + rect.width / 2 - 0.5}px, ${rect.top + rect.height / 2 - 0.5}px) scale(${rect.width}, ${rect.height})`;
		targetIndicator.classList.add("visible");
	} else if(targetIndicator.classList.contains("visible")) {
		targetIndicator.style.transform = "";
		targetIndicator.classList.remove("visible");
	}
};
let allowDrag = true;
document.addEventListener("dragstart", () => {
	allowDrag = false;
}, {
	capture: true,
	passive: true
});
document.addEventListener("dragend", () => {
	allowDrag = true;
}, {
	capture: true,
	passive: true
});
let dragLeaveTimeout;
document.addEventListener("dragover", evt => {
	evt.preventDefault();
	clearTimeout(dragLeaveTimeout);
	if(allowDrag && Miro.focused()) {
		if(evt.dataTransfer.types.includes("Files") || evt.dataTransfer.types.includes("text/uri-list")) {
			indicateTarget(container);
		}
	}
}, true);
document.addEventListener("dragleave", evt => {
	dragLeaveTimeout = setTimeout(indicateTarget, 100);
}, {
	capture: true,
	passive: true
});
document.addEventListener("drop", evt => {
	evt.preventDefault();
	if(allowDrag && Miro.focused()) {
		if(evt.dataTransfer.files.length) {
			Array.prototype.forEach.call(evt.dataTransfer.files, addFile);
		} else if(project && evt.dataTransfer.types.includes("text/uri-list")) {
			addFileFromURI(evt.dataTransfer.getData("text/uri-list"));
		}
		indicateTarget();
	}
}, true);
