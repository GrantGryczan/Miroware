"use strict";
const container = document.body.querySelector("#container");
const files = container.querySelector("#files");
const getSize = size => {
	if(size < 1024) {
		return `${size} B`;
	}
	size /= 1024;
	if(size < 1024) {
		return `${Math.round(100 * size) / 100} KB`;
	}
	size /= 1024;
	if(size < 1024) {
		return `${Math.round(100 * size) / 100} MB`;
	}
	size /= 1024;
	if(size < 1024) {
		return `${Math.round(100 * size) / 100} GB`;
	}
	size /= 1024;
	if(size < 1024) {
		return `${Math.round(100 * size) / 100} TB`;
	}
	size /= 1024;
	if(size < 1024) {
		return `${Math.round(100 * size) / 100} PB`;
	}
	size /= 1024;
	if(size < 1024) {
		return `${Math.round(100 * size) / 100} EB`;
	}
	size /= 1024;
	if(size < 1024) {
		return `${Math.round(100 * size) / 100} ZB`;
	}
	size /= 1024;
	return `${Math.round(100 * size) / 100} YB`;
};
const getDate = date => new Date(date).toString().split(" ").slice(1, 5).join(" ");
let loading = 0;
const subtractLoading = () => {
	loading--;
};
const addFile = file => {
	loading++;
	const fileSize = getSize(file.size);
	const fileElement = html`
		<table>
			<tbody>
				<tr class="file loading" title="$${file.name}">
					<td class="nameData">$${file.name}</td>
					<td class="typeData">$${file.type || "..."}</td>
					<td class="sizeData">${fileSize}</td>
					<td class="dateData">${getDate(Date.now())}</td>
				</tr>
			</tbody>
		</table>
	`.querySelector("tr");
	const typeData = fileElement.querySelector(".typeData");
	const sizeData = fileElement.querySelector(".sizeData");
	const dateData = fileElement.querySelector(".dateData");
	files.insertBefore(fileElement, files.firstChild);
	let xhr;
	Miro.request("POST", "/users/@me/pipe", {
		"Content-Type": "application/octet-stream",
		"X-Data": JSON.stringify({
			name: file.name
		})
	}, file, xhrArg => {
		xhr = xhrArg;
		xhr.upload.addEventListener("progress", evt => {
			fileElement.style.backgroundSize = `${100 * evt.loaded / evt.total}%`;
			sizeData.textContent = `${getSize(evt.loaded)} / ${fileSize}`;
		});
	}).then(Miro.response(() => {
		typeData.textContent = xhr.response.mime;
		sizeData.textContent = fileSize;
		dateData.textContent = getDate(xhr.response.date);
	}, () => {
		fileElement.parentNode.removeChild(fileElement);
	})).finally(subtractLoading);
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
window.onbeforeunload = () => loading || undefined;
