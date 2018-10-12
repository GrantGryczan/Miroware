"use strict";
const container = document.body.querySelector("#container");
let loading = 0;
const addFile = file => {
	loading++;
	const failure = () => {
		loading--;
	};
	Miro.request("POST", "/users/@me/pipe", {}, {
		name: file.name
	}).then(Miro.response(async xhr => {
		Miro.request("PUT", `/users/@me/pipe/${xhr.response.id}/data`, {
			"Content-Type": "application/octet-stream"
		}, file, xhr => {
			xhr.upload.addEventListener("progress", evt => {
				console.log(evt.loaded, evt.total, Math.floor(100 * evt.loaded / evt.total));
			});
		}).then(Miro.response(() => {
			new Miro.Dialog("Upload", `https://pipe.miroware.io/${xhr.response.user}/${encodeURIComponent(xhr.response.name)}`);
		}, failure));
	}, failure));
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
	if(dragLeaveTimeout) {
		clearTimeout(dragLeaveTimeout);
		dragLeaveTimeout = null;
	}
	if(allowDrag && Miro.focused()) {
		if(evt.dataTransfer.types.includes("Files") || evt.dataTransfer.types.includes("text/uri-list")) {
			indicateTarget(container);
		}
	}
}, true);
document.addEventListener("dragleave", evt => {
	if(dragLeaveTimeout) {
		clearTimeout(dragLeaveTimeout);
	}
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
const htmlFilenameTest = /\/([^\/]+?)"/;
document.addEventListener("paste", async evt => {
	if(Miro.focused() && !Miro.typing() && evt.clipboardData.items.length) {
		let file;
		let string;
		for(const item of evt.clipboardData.items) {
			if(item.kind === "file") {
				file = item;
			} else if(item.kind === "string") {
				string = item;
			}
		}
		if(file) {
			file = file.getAsFile();
			if(string) {
				const htmlFilename = (await new Promise(string.getAsString.bind(string))).match(htmlFilenameTest);
				Object.defineProperty(file, "name", {
					value: htmlFilename ? htmlFilename[1] : "Image"
				});
			}
			addFile(file);
		}
	}
}, {
	capture: true,
	passive: true
});
