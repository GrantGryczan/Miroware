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
const titleBar = document.body.querySelector(".mdc-top-app-bar__title");
titleBar.appendChild(html`
	<span>
		/ <a class="ancestor" href="#">${Miro.data.user.name}</a>
	</span>
`);
const ancestors = document.body.querySelector("#ancestors");
titleBar.appendChild(ancestors);
let path = "";
const getName = name => path ? name.slice(path.length + 1) : name;
const applyPath = name => (path ? `${path}/` : "") + name;
const getURL = item => `https://pipe.miroware.io/${Miro.data.user.id}/${encodeURI(item.name)}`;
const pipe = [];
const cachedPaths = [];
const getItem = name => pipe.find(item => item.name === name);
const setItem = item => {
	const itemIndex = pipe.findIndex(({id}) => id === item.id);
	if(itemIndex === -1) {
		pipe.push(item);
	} else {
		pipe.splice(itemIndex, 1, item);
	}
	return item;
};
const currentItems = item => (!path && !item.name.includes("/")) || (item.name.startsWith(path) && item.name.slice(path.length).lastIndexOf("/") === 0);
const sort = {
	name: (a, b) => b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1,
	size: (a, b) => b.size - a.size || b.date - a.date,
	type: (a, b) => b.type < a.type ? 1 : (b.type > a.type ? -1 : b.date - a.date),
	date: (a, b) => b.date - a.date
};
const SORT_DEFAULT = "date";
let sortValue = localStorage.pipe_sortItems in sort ? localStorage.pipe_sortItems : SORT_DEFAULT;
let reverseValue = +localStorage.pipe_reverseItems;
const header = document.body.querySelector("#header");
const sortButtons = header.querySelectorAll(".cell.sort > button");
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
const checkName = async name => {
	let takenItem;
	let fullName = applyPath(name);
	while(takenItem = getItem(fullName)) {
		const value = await new Miro.Dialog("Error", html`
			<b>$${name}</b> already exists.
		`, ["Replace", "Rename", "Cancel"]);
		if(value === 0) {
			if(await new Miro.Dialog("Replace", html`
				Are you sure you want to replace <b>$${name}</b>?
			`, ["Yes", "No"]) === 0) {
				// TODO: delete takenItem
			}
		} else if(value === 1) {
			const dialog = new Miro.Dialog("Rename", html`
				Enter a new name for <b>$${name}</b>.<br>
				<div class="mdc-text-field">
					<input name="name" class="mdc-text-field__input" type="text" value="$${name}" maxlength="255" size="24" pattern="^[^/]+$" autocomplete="off" spellcheck="false" required>
					<div class="mdc-line-ripple"></div>
				</div>
			`, [{
				text: "Okay",
				type: "submit"
			}, "Cancel"]);
			await Miro.wait();
			dialog.form.elements.name.focus();
			const extensionIndex = dialog.form.elements.name.value.lastIndexOf(".");
			dialog.form.elements.name.setSelectionRange(0, extensionIndex > 0 ? extensionIndex : dialog.form.elements.name.value.length);
			if(await dialog === 0) {
				name = dialog.form.elements.name.value;
			}
		} else {
			return false;
		}
		fullName = applyPath(name);
	}
	return name;
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
		this.element.addEventListener("click", this.click.bind(this));
	}
	get name() {
		return this[_name];
	}
	set name(value) {
		const oldName = this.name;
		const typeDirectory = this.type === "/";
		const slashIndex = (this[_name] = value).lastIndexOf("/");
		this.nameElement.textContent = this.nameElement.title = slashIndex === -1 ? value : value.slice(slashIndex + 1);
		this.element.href = typeDirectory ? `#${value}` : getURL(this);
		if(oldName) {
			if(typeDirectory) {
				const pathIndex = cachedPaths.indexOf(oldName);
				if(pathIndex !== -1) {
					cachedPaths.splice(pathIndex, 1, value);
				}
				const prefix = `${this.name}/`;
				for(const item of pipe) {
					if(item.name.startsWith(prefix) && !item.name.includes("/", prefix.length)) {
						item.name = value + item.name.slice(oldName.length);
					}
				}
			}
			let ancestry = "";
			for(const name of oldName.split("/").slice(0, -1)) {
				const item = getItem(ancestry += (ancestry && "/") + name);
				if(item) {
					item.size -= this.size;
				}
			}
			ancestry = "";
			for(const name of this.name.split("/").slice(0, -1)) {
				const item = getItem(ancestry += (ancestry && "/") + name);
				if(item) {
					item.size += this.size;
				}
			}
		}
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
	click(evt) {
		evt.preventDefault();
	}
	delete() {
		if(selectedItem === this.element) {
			selectedItem = null;
		}
		if(focusedItem === this.element) {
			focusedItem = null;
		}
		if(this.type === "/") {
			const pathIndex = cachedPaths.indexOf(this.name);
			if(pathIndex !== -1) {
				cachedPaths.splice(pathIndex, 1, this.name);
			}
			const prefix = `${this.name}/`;
			for(const item of pipe) {
				if(item.name.startsWith(prefix) && !item.name.includes("/", prefix.length)) {
					item.delete();
				}
			}
		}
		let ancestry = "";
		for(const name of this.name.split("/").slice(0, -1)) {
			const item = getItem(ancestry += (ancestry && "/") + name);
			if(item) {
				item.size -= this.size;
			}
		}
		pipe.splice(pipe.indexOf(this), 1);
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
class PipeFile {
	constructor(file) {
		this.path = path;
		this.file = file;
		this.element = html`
			<a class="item loading" draggable="false" ondragstart="return false;">
				<div class="label">
					<div class="title" title="$${this.file.name}">$${this.file.name}</div>
					<div class="subtitle" title="0 B / ${this.file.size} B">0% (0 B / ${this.size = getSize(this.file.size)})</div>
				</div>
				<button class="close mdc-icon-button material-icons">close</button>
			</a>
		`;
		(this.closeElement = this.element.querySelector(".close")).addEventListener("click", this.close.bind(this));
		this.subtitleElement = this.element.querySelector(".subtitle");
		Miro.request("POST", `/users/${Miro.data.user.id}/pipe`, {
			"Content-Type": "application/octet-stream",
			"X-Data": JSON.stringify({
				name: applyPath(this.file.name)
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
			setItem(new PipeItem(xhr.response));
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
			this.element.parentNode.replaceChild(new PipeFile(this.file).element, this.element);
			this.dequeue();
		}
	}
}
const addFile = async file => {
	const name = await checkName(file.name);
	if(!name) {
		return;
	} else if(name !== file.name) {
		Object.defineProperty(file, "name", {
			get: () => name
		});
	}
	queuedItems.appendChild(new PipeFile(file).element);
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
class PipeDirectory {
	constructor(name) {
		this.path = path;
		this.name = name;
		Miro.request("POST", `/users/${Miro.data.user.id}/pipe`, {
			"X-Data": JSON.stringify({
				name: applyPath(this.name),
				type: "/"
			})
		}).then(Miro.response(xhr => {
			setItem(new PipeItem(xhr.response));
			cachedPaths.push(xhr.response.name);
			if(path === this.path) {
				render();
			}
		}));
	}
}
creation.querySelector("#addDirectory").addEventListener("click", () => {
	const dialog = new Miro.Dialog("Directory", html`
		Enter a directory name.<br>
		<div class="mdc-text-field">
			<input name="name" class="mdc-text-field__input" type="text" value="$${name}" maxlength="255" size="24" pattern="^[^/]+$" autocomplete="off" spellcheck="false" required>
			<div class="mdc-line-ripple"></div>
		</div>
	`, [{
		text: "Okay",
		type: "submit"
	}, "Cancel"]).then(async value => {
		if(value === 0) {
			const name = await checkName(dialog.form.elements.name.value);
			if(!name) {
				return;
			}
			new PipeDirectory(name);
		}
	});
});
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
const render = () => {
	while(ancestors.lastChild) {
		ancestors.removeChild(ancestors.lastChild);
	}
	if(path) {
		let ancestry = "";
		for(const name of path.split("/")) {
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
		sortValue = SORT_DEFAULT;
	}
	const itemArray = pipe.filter(currentItems).sort(sort[sortValue]);
	for(const item of reverseValue ? itemArray.reverse() : itemArray) {
		items.appendChild(item.element);
	}
	updateProperties();
};
const hashChange = () => {
	if(!cachedPaths.includes(path = decodeURI(location.hash.slice(1)))) {
		Miro.request("GET", `/users/${Miro.data.user.id}/pipe?path=${encodeURIComponent(path)}`).then(Miro.response(xhr => {
			for(const item of xhr.response) {
				setItem(new PipeItem(item));
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
let selectedItem = null;
let focusedItem = null;
const selectItem = (target, evt, button) => {
	const superKey = evt.ctrlKey || evt.metaKey;
	if(button === 2 && !(superKey || evt.shiftKey)) {
		if(!target.classList.contains("selected")) {
			for(const item of items.querySelectorAll(".item.selected")) {
				item.classList.remove("selected");
			}
			target.classList.add("selected");
			selectedItem = focusedItem = target;
		}
	} else if(evt.shiftKey) {
		let selecting = !selectedItem;
		const classListMethod = superKey && selectedItem && !selectedItem.classList.contains("selected") ? "remove" : "add";
		for(const itemElement of items.querySelectorAll(".item")) {
			if(itemElement === selectedItem || itemElement === target) {
				if(selecting) {
					itemElement.classList[classListMethod]("selected");
					selecting = false;
					continue;
				} else {
					itemElement.classList[classListMethod]("selected");
					if(selectedItem !== target) {
						selecting = true;
					}
				}
			} else if(selecting) {
				itemElement.classList[classListMethod]("selected");
			} else if(!superKey) {
				itemElement.classList.remove("selected");
			}
		}
	} else {
		selectedItem = target;
		focusedItem = target;
		if(superKey) {
			target.classList.toggle("selected");
		} else {
			let othersSelected = false;
			for(const itemElement of items.querySelectorAll(".item.selected")) {
				if(itemElement !== target) {
					othersSelected = true;
					itemElement.classList.remove("selected");
				}
			}
			if(target.classList[othersSelected ? "add" : "toggle"]("selected") === false) {
				selectedItem = null;
			}
		}
	}
	updateProperties();
};
let mouseX = 0;
let mouseY = 0;
let mouseTarget;
let mouseDown = -1;
let mouseMoved = false;
document.addEventListener("mousedown", evt => {
	mouseMoved = false;
	mouseX = evt.clientX;
	mouseY = evt.clientY;
	if(evt.button !== 0 && evt.button !== 2) {
		return;
	}
	mouseTarget = evt.target;
	mouseDown = evt.button;
	if(evt.target.parentNode._item) {
		focusedItem = evt.target.parentNode;
	}
}, {
	capture: true,
	passive: true
});
document.addEventListener("mouseup", evt => {
	if(mouseDown !== -1 && items.contains(mouseTarget)) {
		if(mouseTarget.parentNode._item) {
			if(mouseMoved) {
				if(indicatedTarget) {
					const sourcePath = path;
					for(const itemElement of items.querySelectorAll(".item.selected")) {
						itemElement.classList.remove("selected");
						itemElement.classList.add("loading");
						const targetName = indicatedTarget._item ? indicatedTarget._item.name : decodeURI(indicatedTarget.href.slice(indicatedTarget.href.indexOf("#") + 1));
						const name = getName(itemElement._item.name);
						Miro.request("PUT", `/users/@me/pipe/${itemElement._item.id}`, {}, {
							name: targetName ? `${targetName}/${name}` : name
						}).then(Miro.response(xhr => {
							itemElement._item.name = xhr.response.name;
							itemElement.classList.remove("loading");
							if(sourcePath === path) {
								render();
							}
						}, () => {
							itemElement.classList.remove("loading");
							updateProperties();
						}));
					}
					if(!indicatedTarget.href) {
						indicatedTarget.classList.add("selected");
					}
					indicateTarget();
				}
			} else {
				selectItem(mouseTarget.parentNode, evt, evt.button);
			}
		} else if(!mouseMoved) {
			for(const item of items.querySelectorAll(".item.selected")) {
				item.classList.remove("selected");
			}
			selectedItem = focusedItem = null;
			updateProperties();
		}
	}
	mouseTarget = null;
	mouseDown = -1;
}, {
	capture: true,
	passive: true
});
document.addEventListener("dblclick", evt => {
	if(!mouseMoved && evt.target.parentNode._item) {
		selectItem(evt.target.parentNode, evt, 2);
		// TODO: open item
	}
}, {
	capture: true,
	passive: true
});
document.addEventListener("mousemove", evt => {
	if(evt.clientX === mouseX && evt.clientY === mouseY) {
		return;
	}
	mouseX = evt.clientX;
	mouseY = evt.clientY;
	if(mouseDown !== -1 && mouseTarget && mouseTarget.parentNode._item) {
		if(!mouseMoved) {
			selectItem(mouseTarget.parentNode, evt, 2);
		}
		indicateTarget(evt.target.classList.contains("ancestor") ? evt.target : evt.target.parentNode._item && evt.target.parentNode._item.type === "/" && !evt.target.parentNode.classList.contains("selected") && !evt.target.parentNode.classList.contains("loading") && evt.target.parentNode);
	}
	mouseMoved = true;
}, {
	capture: true,
	passive: true
});
const properties = document.body.querySelector("#properties");
const property = {};
for(const propertyElement of properties.querySelectorAll("[data-key]")) {
	property[propertyElement.getAttribute("data-key")] = propertyElement;
}
const linkPreview = property.url.querySelector("#linkPreview");
const save = property.actions.querySelector("#save");
const selectionLength = properties.querySelector("#selectionLength");
const selectionSize = properties.querySelector("#selectionSize");
const sizeReducer = (size, itemElement) => size + itemElement._item.size;
const updateProperties = () => {
	for(const propertyElement of Object.values(property)) {
		propertyElement.classList.add("hidden");
	}
	const selected = items.querySelectorAll(".item.selected");
	if(selectionLength.textContent = selected.length) {
		property.actions.classList.remove("hidden");
		selectionSize.textContent = getSize(Array.prototype.reduce.call(selected, sizeReducer, 0));
		if(selected.length === 1) {
			const item = selected[0]._item;
			properties.elements.name._prev = properties.elements.name.value = getName(item.name);
			property.name.classList.remove("hidden");
			properties.elements.name.parentNode.classList.remove("mdc-text-field--invalid");
			if(item.type !== "/") {
				properties.elements.type._prev = properties.elements.type.value = item.type;
				property.type.classList.remove("hidden");
				properties.elements.type.parentNode.classList.remove("mdc-text-field--invalid");
				properties.elements.url._prev = properties.elements.url.value = linkPreview.href = getURL(item);
				property.url.classList.remove("hidden");
				properties.elements.url.parentNode.classList.remove("mdc-text-field--invalid");
			}
			save.disabled = true;
		}
	} else {
		selectionSize.textContent = "0 B";
	}
};
property.url.querySelector("#copyURL").addEventListener("click", () => {
	properties.elements.url.select();
	document.execCommand("copy");
	Miro.snackbar("URL copied to clipboard");
});
property.actions.querySelector("#download").addEventListener("click", () => {
	
});
const removeItem = itemElement => {
	itemElement.classList.add("loading");
	Miro.request("DELETE", `/users/@me/pipe/${itemElement._item.id}`).then(Miro.response(() => {
		itemElement._item.delete();
		render();
	}, () => {
		itemElement.classList.remove("loading");
	}));
};
const confirmRemoveItem = itemElement => {
	new Miro.Dialog("Remove Item", html`
		Are you sure you want to remove <b>$${getName(itemElement._item.name)}</b>?<br>
		Items inside directories will also be removed.<br>
		This cannot be undone.
	`, ["Yes", "No"]).then(value => {
		if(value === 0) {
			removeItem(itemElement);
		}
	});
};
const confirmRemoveItems = itemElements => {
	if(itemElements.length) {
		if(itemElements.length === 1) {
			confirmRemoveItem(itemElements[0]);
		} else if(itemElements.length !== 1) {
			new Miro.Dialog("Remove Items", html`
				Are you sure you want to remove all those items?<br>
				Items inside directories will also be removed.<br>
				This cannot be undone.
			`, ["Yes", "No"]).then(value => {
				if(value === 0) {
					itemElements.forEach(removeItem);
				}
			});
		}
	}
};
property.actions.querySelector("#delete").addEventListener("click", () => {
	confirmRemoveItems(items.querySelectorAll(".item.selected"));
});
for(const input of properties.elements) {
	input._input = input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement;
}
const changed = [];
const onInput = evt => {
	changed.length = 0;
	for(const input of properties.elements) {
		if(input._input && !input.classList.contains("hidden")) {
			if(input.checkValidity()) {
				if(input._prev !== Miro.value(input)) {
					changed.push(input);
				}
			} else {
				changed.length = 0;
				break;
			}
		}
	}
	save.disabled = !changed.length;
};
properties.addEventListener("input", onInput);
properties.addEventListener("change", onInput);
properties.addEventListener("submit", evt => {
	evt.preventDefault();
	const changedName = changed.includes(properties.elements.name);
	if(changedName) {
		let name = await checkName(properties.elements.name.value);
		if(!name) {
			return;
		}
		properties.elements.name.value = name;
	}
	const itemElement = items.querySelector(".item.selected");
	itemElement.classList.add("loading");
	const data = {};
	if(changedName) {
		data.name = applyPath(properties.elements.name.value);
	}
	const changedType = changed.includes(properties.elements.type);
	if(changedType) {
		data.type = properties.elements.type.value;
	}
	Miro.request("PUT", `/users/@me/pipe/${itemElement._item.id}`, {}, data).then(Miro.response(xhr => {
		if(changedName) {
			itemElement._item.name = xhr.response.name;
		}
		if(changedType) {
			itemElement._item.type = xhr.response.type;
		}
		render();
	})).finally(() => {
		itemElement.classList.remove("loading");
	});
});
updateProperties();
