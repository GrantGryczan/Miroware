"use strict";
const getSize = size => {
	if(size < 1000) {
		return `${size} B`;
	}
	size /= 1000;
	if(size < 1000) {
		return `${Math.round(10 * size) / 10} kB`;
	}
	size /= 1000;
	if(size < 1000) {
		return `${Math.round(10 * size) / 10} MB`;
	}
	size /= 1000;
	if(size < 1000) {
		return `${Math.round(10 * size) / 10} GB`;
	}
	size /= 1000;
	if(size < 1000) {
		return `${Math.round(10 * size) / 10} TB`;
	}
	size /= 1000;
	if(size < 1000) {
		return `${Math.round(10 * size) / 10} PB`;
	}
	size /= 1000;
	if(size < 1000) {
		return `${Math.round(10 * size) / 10} EB`;
	}
	size /= 1000;
	if(size < 1000) {
		return `${Math.round(10 * size) / 10} ZB`;
	}
	size /= 1000;
	return `${Math.round(10 * size) / 10} YB`;
};
const getDate = date => String(new Date(date)).split(" ").slice(1, 5).join(" ");
const container = document.body.querySelector("#container");
const targetIndicator = document.body.querySelector("#targetIndicator");
let indicatedTarget;
const indicateTarget = target => {
	indicatedTarget = target;
	if(target) {
		const rect = target.getBoundingClientRect();
		targetIndicator.style.transform = `translate(${rect.left + rect.width / 2 - 0.5}px, ${rect.top + rect.height / 2 - 0.5}px) scale(${rect.width}, ${rect.height})`;
		targetIndicator.classList.add("visible");
	} else if(targetIndicator.classList.contains("visible")) {
		targetIndicator.style.transform = "";
		targetIndicator.classList.remove("visible");
	}
};
class PipeItem {
	constructor(item) {
		this.name = item.name; // TODO: apply parent
		this.size = item.size;
		(this.element = html`
			<a class="item" draggable="false" ondragstart="return false;">
				<div class="title" title="$${this.name}">$${this.name}</div>
				<div class="subtitle" title="${this.size}">getSize(this.file.size)})</div>
			</a>
		`)._item = this;
	}
}
const creation = container.querySelector("#creation");
const queuedItems = container.querySelector("#queuedItems");
const queue = [];
const queueReducer = (progress, item) => {
	progress.loaded += item.loaded;
	progress.total += item.file.size;
	return progress;
};
const updateQueue = () => {
	if(!queue.length) {
		creation.classList.remove("loading");
		return;
	}
	const {loaded, total} = queue.reduce(queueReducer, {
		loaded: 0,
		total: 0
	});
	const done = loaded === total;
	if(done) {
		creation.classList.remove("loading");
		queue.length = 0;
	} else {
		creation.classList.add("loading");
		creation.style.backgroundSize = `${100 * (done ? 1 : loaded / total)}%`;
	}
};
window.onbeforeunload = () => container.querySelector(".loading") || undefined;
class PipeQueuedItem {
	constructor(file) {
		this.file = file;
		(this.element = html`
			<a class="item loading" draggable="false" ondragstart="return false;">
				<div class="label">
					<div class="title" title="$${this.file.name}">$${this.file.name}</div>
					<div class="subtitle" title="0 / ${this.file.size}">0% (${getSize(0)} / ${getSize(this.file.size)})</div>
				</div>
				<button class="close mdc-icon-button material-icons">close</button>
			</a>
		`)._item = this;
		(this.closeElement = this.element.querySelector(".close")).addEventListener("click", this.close.bind(this));
		this.subtitleElement = this.element.querySelector(".subtitle");
		Miro.request("POST", "/users/@me/pipe", {
			"Content-Type": "application/octet-stream",
			"X-Data": JSON.stringify({
				name: name // TODO: apply parent
			})
		}, this.file, xhr => {
			this.xhr = xhr;
			this.loaded = 0;
			this.xhr.upload.addEventListener("progress", evt => {
				if(this.xhr.readyState !== XMLHttpRequest.DONE) {
					const percentage = 100 * ((this.loaded = evt.loaded) / this.file.size || 1);
					this.element.style.backgroundSize = `${percentage}%`;
					this.subtitleElement.title = `${this.loaded} / ${this.file.size}`;
					this.subtitleElement.textContent = `${Math.floor(10 * percentage) / 10}% (${getSize(this.loaded)} / ${getSize(this.file.size)})`;
					updateQueue();
				}
			});
			queue.push(this);
			updateQueue();
		}, true).then(Miro.response(xhr => {
			this.element.classList.remove("loading");
			this.closeElement.textContent = "done";
		}, (xhr, error) => {
			this.element.classList.remove("loading");
			this.element.classList.add("error");
			this.subtitleElement.title = error;
			this.subtitleElement.textContent = "An error occurred. Click to retry.";
			this.element.addEventListener("click", this.retry.bind(this));
			if(this.dequeue()) {
				updateQueue();
			}
		}));
	}
	dequeue() {
		const queueIndex = queue.indexOf(this);
		if(queueIndex === -1) {
			return false;
		} else {
			queue.splice(queueIndex, 1);
			return true;
		}
	}
	async close() {
		if(this.element.classList.contains("loading") && await new Miro.Dialog("Cancel", html`
			Are you sure you want to cancel uploading <b>$${this.file.name}</b>?
		`, ["Yes", "No"]) !== 0) {
			return;
		}
		if(this.element.parentNode) {
			this.xhr.abort();
			this.element.parentNode.removeChild(this.element);
			if(this.dequeue()) {
				updateQueue();
			}
		}
	}
	retry(evt) {
		if(!this.closeElement.contains(evt.target)) {
			this.element.parentNode.replaceChild(new PipeQueuedItem(this.file).element, this.element);
			this.dequeue();
		}
	}
}
const addFile = file => {
	// TODO: check names
	queuedItems.appendChild(new PipeQueuedItem(file).element);
};
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.multiple = true;
fileInput.addEventListener("change", () => {
	Array.prototype.forEach.call(fileInput.files, addFile);
	fileInput.value = null;
});
const addFiles = creation.querySelector("#addFiles");
addFiles.addEventListener("click", fileInput.click.bind(fileInput));
const htmlFilenameTest = /\/([^\/]+?)"/;
document.addEventListener("paste", async evt => {
	if(Miro.focused() && !Miro.typing() && evt.clipboardData.items.length) {
		let file;
		let string;
		for(const dataTransferItem of evt.clipboardData.items) {
			if(dataTransferItem.kind === "file") {
				file = dataTransferItem;
			} else if(dataTransferItem.kind === "string") {
				string = dataTransferItem;
			}
		}
		if(file) {
			file = file.getAsFile();
			if(string) {
				const htmlFilename = (await new Promise(string.getAsString.bind(string))).match(htmlFilenameTest);
				Object.defineProperty(file, "name", {
					value: htmlFilename ? htmlFilename[1] : "file"
				});
			}
			addFile(file);
		}
	}
}, {
	capture: true,
	passive: true
});
let allowDrop = true;
document.addEventListener("dragstart", () => {
	allowDrop = false;
}, {
	capture: true,
	passive: true
});
document.addEventListener("dragend", () => {
	allowDrop = true;
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
	if(allowDrop && Miro.focused()) {
		if(evt.dataTransfer.types.includes("Files") || evt.dataTransfer.types.includes("text/uri-list")) {
			indicateTarget(container);
		}
	}
}, true);
document.addEventListener("dragleave", () => {
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
	if(allowDrop && Miro.focused()) {
		if(evt.dataTransfer.files.length) {
			Array.prototype.forEach.call(evt.dataTransfer.files, addFile);
		}/* else if(evt.dataTransfer.types.includes("text/uri-list")) {
			addURL(evt.dataTransfer.getData("text/uri-list"));
		}*/
		indicateTarget();
	}
}, true);
