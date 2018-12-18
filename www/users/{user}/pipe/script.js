"use strict";
document.title += ` / ${Miro.data.name}`;
const getDate = date => String(date).split(" ").slice(1, 5).join(" ");
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
const items = container.querySelector("#items");
const _name = Symbol("name");
const _size = Symbol("size");
const _type = Symbol("type");
const _date = Symbol("date");
class PipeItem {
	constructor(item) {
		this.id = item.id;
		(this.element = html`
			<a class="item" draggable="false" ondragstart="return false;">
				<div class="cell icon">
					<button class="mdc-icon-button material-icons"></button>
				</div>
				<div class="cell name"></div>
				<div class="cell size"></div>
				<div class="cell type"></div>
				<div class="cell date"></div>
			</a>
		`)._item = this;
		this.iconElement = this.element.querySelector(".icon > button");
		this.nameElement = this.element.querySelector(".name");
		this.sizeElement = this.element.querySelector(".size");
		this.typeElement = this.element.querySelector(".type");
		this.dateElement = this.element.querySelector(".date");
		this.type = item.type;
		this.name = item.name;
		this.size = item.size;
		this.date = new Date(item.date);
	}
	get name() {
		return this[_name];
	}
	set name(value) {
		const slashIndex = (this[_name] = value).lastIndexOf("/");
		this.nameElement.textContent = this.nameElement.title = slashIndex === -1 ? value : value.slice(slashIndex + 1);
		this.element.href = this.type === "/" ? `#${value}` : `https://pipe.miroware.io/${Miro.data.id}/${value}`;
	}
	get size() {
		return this[_size];
	}
	set size(value) {
		this.sizeElement.textContent = getSize(this.sizeElement.title = this[_size] = value);
	}
	get type() {
		return this[_type];
	}
	set type(value) {
		const typeDirectory = (this[_type] = value) === "/";
		this.typeElement.textContent = this.typeElement.title = typeDirectory ? "" : value;
		this.iconElement.textContent = typeDirectory ? "folder" : (value.startsWith("image/") ? "image" : (value.startsWith("audio/") ? "audiotrack" : (value.startsWith("video/") ? "movie" : "insert_drive_file")));
	}
	get date() {
		return this[_date];
	}
	set date(value) {
		this.dateElement.textContent = getDate(this.dateElement.title = this[_date] = value);
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
let path = "";
const ancestors = document.body.querySelector("#ancestors");
document.body.querySelector(".mdc-top-app-bar__title").appendChild(ancestors);
const sort = {
	name: (a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1,
	size: (a, b) => (a.size || Infinity) - (b.size || Infinity) || a.date - b.date,
	type: (a, b) => a.type < b.type ? 1 : (a.type > b.type ? -1 : a.date - b.date),
	date: (a, b) => a.date - b.date
};
const itemCache = {};
const currentItems = item => (!path && !item.name.includes("/")) || (item.name.startsWith(path) && item.name.slice(path.length).lastIndexOf("/") === 0);
const render = () => {
	while(ancestors.lastChild) {
		ancestors.removeChild(ancestors.lastChild);
	}
	ancestors.appendChild(html`
		<span>
			/ <a class="ancestor" href="#">${Miro.data.name}</a>
		</span>
	`);
	if(path) {
		let ancestry = "";
		const names = path.split("/");
		for(const name of names) {
			ancestors.appendChild(html`
				<span>
					/ <a class="ancestor" href="#$${ancestry += (ancestry && "/") + name}">$${name}</a>
				</span>
			`);
		}
	}
	while(items.lastChild) {
		items.removeChild(items.lastChild);
	}
	if(!(localStorage.pipe_sortItems in sort)) {
		localStorage.pipe_sortItems = "type";
	}
	const itemArray = Object.values(itemCache).filter(currentItems).sort(sort[localStorage.pipe_sortItems]);
	for(const item of +localStorage.pipe_reverseItems ? itemArray.reverse() : itemArray) {
		items.appendChild(item.element);
	}
};
const hashChange = () => {
	path = decodeURI(location.hash.slice(1));
	Miro.request("GET", `/users/@me/pipe?path=${encodeURIComponent(path)}`).then(Miro.response(xhr => {
		for(const itemData of +localStorage.pipe_reverseItems ? itemArray.reverse() : xhr.response) {
			itemCache[itemData.id] = new PipeItem(itemData);
		}
		render();
	}));
};
hashChange();
window.addEventListener("hashchange", hashChange);
