"use strict";
document.title += ` / ${Miro.data.user.name}`;
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
		this.element.href = this.type === "/" ? `#${value}` : `https://pipe.miroware.io/${Miro.data.user.id}/${value}`;
	}
	get size() {
		return this[_size];
	}
	set size(value) {
		this.sizeElement.textContent = getSize(this[_size] = value);
		this.sizeElement.title = `${value} B`;
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
					<div class="subtitle" title="0 B / ${this.file.size} B">0% (0 B / ${this.size = getSize(this.file.size)})</div>
				</div>
				<button class="close mdc-icon-button material-icons">close</button>
			</a>
		`)._item = this;
		(this.closeElement = this.element.querySelector(".close")).addEventListener("click", this.close.bind(this));
		this.subtitleElement = this.element.querySelector(".subtitle");
		Miro.request("POST", `/users/${Miro.data.user.id}/pipe`, {
			"Content-Type": "application/octet-stream",
			"X-Data": JSON.stringify({
				name: ((this.path = path) ? `${path}/` : "") + this.file.name
			})
		}, this.file, xhr => {
			this.xhr = xhr;
			this.loaded = 0;
			this.xhr.upload.addEventListener("progress", evt => {
				if(this.xhr.readyState !== XMLHttpRequest.DONE) {
					const percentage = 100 * ((this.loaded = evt.loaded) / this.file.size || 1);
					this.element.style.backgroundSize = `${percentage}%`;
					this.subtitleElement.title = `${this.loaded} B / ${this.file.size} B`;
					this.subtitleElement.textContent = `${Math.floor(10 * percentage) / 10}% (${getSize(this.loaded)} / ${this.size})`;
					updateQueue();
				}
			});
			queue.push(this);
			updateQueue();
		}, true).then(Miro.response(xhr => {
			this.element.classList.remove("loading");
			this.element.href = `#${this.path}`;
			this.subtitleElement.title = `${this.file.size} B`;
			this.subtitleElement.textContent = this.size;
			this.closeElement.textContent = "done";
			itemCache[xhr.response.id] = new PipeItem(xhr.response);
			if(path === this.path) {
				render();
			}
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
	async close(evt) {
		if(evt instanceof Event) {
			evt.preventDefault();
		}
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
const addFile = async file => {
	let name;
	let takenItem;
	while(takenItem = Object.values(itemCache).find(({name}) => name === file.name)) {
		const value = await new Miro.Dialog("Error", html`
			<b>$${file.name}</b> already exists.
		`, ["Replace", "Rename", "Cancel"]);
		if(value === 0) {
			if(await new Miro.Dialog("Replace", html`
				Are you sure you want to replace <b>$${file.name}</b>?
			`, ["Yes", "No"]) === 0) {
				// TODO: delete itemTaken
			}
		} else if(value === 1) {
			const dialog = new Miro.Dialog("Rename", html`
				Enter a new name for <b>$${file.name}</b>.<br>
				<div class="mdc-text-field">
					<input name="name" class="mdc-text-field__input" type="text" value="$${file.name}" maxlength="255" size="24" pattern="^[^/]+$" autocomplete="off" spellcheck="false" required>
					<div class="mdc-line-ripple"></div>
				</div>
			`, [{
				text: "Okay",
				type: "submit"
			}, "Cancel"]);
			const extensionIndex = file.name.lastIndexOf(".");
			if(extensionIndex > 0) {
				dialog.form.elements.name.selectionEnd = extensionIndex;
			}
			if(await dialog === 0) {
				if(!name) {
					Object.defineProperty(file, "name", {
						get: () => name
					});
				}
				name = dialog.form.elements.name.value;
			}
		} else {
			return;
		}
	}
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
const titleBar = document.body.querySelector(".mdc-top-app-bar__title");
titleBar.appendChild(html`
	<span>
		/ <a class="ancestor" href="#">${Miro.data.user.name}</a>
	</span>
`);
const ancestors = document.body.querySelector("#ancestors");
titleBar.appendChild(ancestors);
let path = "";
const cachedPaths = [];
const itemCache = {};
const currentItems = item => (!path && !item.name.includes("/")) || (item.name.startsWith(path) && item.name.slice(path.length).lastIndexOf("/") === 0);
const sort = {
	name: (a, b) => b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1,
	size: (a, b) => b.size - a.size || b.date - a.date,
	type: (a, b) => b.type < a.type ? 1 : (b.type > a.type ? -1 : b.date - a.date),
	date: (a, b) => b.date - a.date
};
let sortValue = localStorage.pipe_sortItems in sort ? localStorage.pipe_sortItems : "type";
let reverseValue = +localStorage.pipe_reverseItems;
const sortButtons = document.body.querySelectorAll(".cell.sort > button");
const clickSort = evt => {
	if(evt.target.classList.contains("sorting")) {
		reverseValue = +!reverseValue;
	} else {
		for(const sortButton of sortButtons) {
			const target = sortButton === evt.target;
			sortButton.classList[target ? "add" : "remove"]("sorting");
			sortButton.textContent = target ? "arrow_downward" : "sort";
		}
	}
	localStorage.pipe_sortItems = sortValue = evt.target._sort;
	evt.target.classList[(localStorage.pipe_reverseItems = reverseValue) ? "add" : "remove"]("reverse");
	render();
};
for(const sortButton of sortButtons) {
	if(sortValue === (sortButton._sort = sortButton.getAttribute("data-sort"))) {
		sortButton.classList.add("sorting");
		sortButton.textContent = "arrow_downward";
		if(reverseValue) {
			sortButton.classList.add("reverse");
		}
	}
	sortButton.addEventListener("click", clickSort);
}
const render = () => {
	while(ancestors.lastChild) {
		ancestors.removeChild(ancestors.lastChild);
	}
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
	if(!(sortValue in sort)) {
		sortValue = "type";
	}
	const itemArray = Object.values(itemCache).filter(currentItems).sort(sort[sortValue]);
	for(const item of reverseValue ? itemArray.reverse() : itemArray) {
		items.appendChild(item.element);
	}
};
const hashChange = () => {
	if(!cachedPaths.includes(path = decodeURI(location.hash.slice(1)))) {
		Miro.request("GET", `/users/${Miro.data.user.id}/pipe?path=${encodeURIComponent(path)}`).then(Miro.response(xhr => {
			for(const item of xhr.response) {
				itemCache[item.id] = new PipeItem(item);
			}
			cachedPaths.push(path);
			render();
		}));
	} else {
		render();
	}
};
hashChange();
window.addEventListener("hashchange", hashChange);
