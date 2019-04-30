"use strict";
document.title += ` / ${Miro.data.user.name}`;
const getDate = date => String(date).split(" ").slice(1, 5).join(" ");
const BYTE_SCALE = 1024;
const getSize = size => {
	if (size < BYTE_SCALE) {
		return `${size} B`;
	}
	size /= BYTE_SCALE;
	if (size < BYTE_SCALE) {
		return `${Math.round(10 * size) / 10} KiB`;
	}
	size /= BYTE_SCALE;
	if (size < BYTE_SCALE) {
		return `${Math.round(10 * size) / 10} MiB`;
	}
	size /= BYTE_SCALE;
	if (size < BYTE_SCALE) {
		return `${Math.round(10 * size) / 10} GiB`;
	}
	size /= BYTE_SCALE;
	if (size < BYTE_SCALE) {
		return `${Math.round(10 * size) / 10} TiB`;
	}
	size /= BYTE_SCALE;
	if (size < BYTE_SCALE) {
		return `${Math.round(10 * size) / 10} PiB`;
	}
	size /= BYTE_SCALE;
	if (size < BYTE_SCALE) {
		return `${Math.round(10 * size) / 10} EiB`;
	}
	size /= BYTE_SCALE;
	if (size < BYTE_SCALE) {
		return `${Math.round(10 * size) / 10} ZiB`;
	}
	size /= BYTE_SCALE;
	return `${Math.round(10 * size) / 10} YiB`;
};
const container = document.body.querySelector("#container");
const targetIndicator = document.body.querySelector("#targetIndicator");
let indicatedTarget;
const indicateTarget = target => {
	indicatedTarget = target;
	if (target) {
		const rect = target.getBoundingClientRect();
		targetIndicator.style.transform = `translate(${rect.left + rect.width / 2 - 0.5}px, ${rect.top + rect.height / 2 - 0.5}px) scale(${rect.width}, ${rect.height})`;
		targetIndicator.classList.add("visible");
	} else if (targetIndicator.classList.contains("visible")) {
		targetIndicator.style.transform = "";
		targetIndicator.classList.remove("visible");
	}
};
const getTargetName = () => indicatedTarget._item ? indicatedTarget._item.name : (indicatedTarget instanceof HTMLAnchorElement ? decodeURI(indicatedTarget.href.slice(indicatedTarget.href.indexOf("#") + 1)) : path);
const titleBar = document.body.querySelector(".mdc-top-app-bar__title");
const ancestors = document.body.querySelector("#ancestors");
titleBar.appendChild(ancestors);
let path = "";
const getName = (name, parent = path) => parent ? name.slice(parent.length + 1) : name;
const applyPath = (name, parent = path) => (parent ? `${parent}/` : "") + name;
const encodedSlashes = /%2F/g;
const encodeForPipe = name => encodeURIComponent(name).replace(encodedSlashes, "/");
const quotationMarks = /\"/g;
const apostrophes = /\'/g;
const openingParentheses = /\(/g;
const closingParentheses = /\)/g;
const pipe = [];
const cachedPaths = [];
const getItem = name => pipe.find(item => item.name === name);
const setItem = item => {
	const itemIndex = pipe.findIndex(({id}) => id === item.id);
	if (itemIndex === -1) {
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
	if (evt.target.classList.contains("sorting")) {
		reverseValue = +!reverseValue;
	} else {
		for (const sortButton of sortButtons) {
			const target = sortButton === evt.target;
			sortButton.classList[target ? "add" : "remove"]("sorting");
			sortButton.textContent = target ? "arrow_downward" : "sort";
		}
	}
	localStorage.pipe_sortItems = sortValue = evt.target._sort;
	evt.target.classList[(localStorage.pipe_reverseItems = reverseValue) ? "add" : "remove"]("reverse");
	render();
};
for (const sortButton of sortButtons) {
	if (sortValue === (sortButton._sort = sortButton.getAttribute("data-sort"))) {
		sortButton.classList.add("sorting");
		sortButton.textContent = "arrow_downward";
		if (reverseValue) {
			sortButton.classList.add("reverse");
		}
	}
	sortButton.addEventListener("click", clickSort);
}
const items = container.querySelector("#items");
const _name = Symbol("name");
const _size = Symbol("size");
const _type = Symbol("type");
const _date = Symbol("date");
const PipeItem = class PipeItem {
	constructor(item) {
		this.id = item.id;
		(this.element = html`
			<a class="item" draggable="false" ondragstart="return false;">
				<div class="cell thumbnail material-icons"></div>
				<div class="cell icon">
					<button class="mdc-icon-button material-icons"></button>
				</div>
				<div class="cell name"></div>
				<div class="cell size"></div>
				<div class="cell type"></div>
				<div class="cell date"></div>
			</a>
		`)._item = this;
		this.element.removeChild(this.thumbnailElement = this.element.querySelector(".cell.thumbnail"));
		this.thumbnailHidden = true;
		this.iconElement = this.element.querySelector(".cell.icon > button");
		this.nameElement = this.element.querySelector(".cell.name");
		this.sizeElement = this.element.querySelector(".cell.size");
		this.typeElement = this.element.querySelector(".cell.type");
		this.dateElement = this.element.querySelector(".cell.date");
		this.type = item.type;
		this.name = item.name;
		this.size = item.size;
		this.privacy = item.privacy;
		this.date = new Date(item.date);
		this.element.addEventListener("click", this.click.bind(this));
	}
	updateThumbnail() {
		if (this.type.startsWith("image/")) {
			this.thumbnailElement.style.backgroundImage = `url(${this.url.replace(quotationMarks, "%22").replace(apostrophes, "%27").replace(openingParentheses, "%28").replace(closingParentheses, "%29")})`;
		} else {
			this.thumbnailElement.style.backgroundImage = "";
			this.thumbnailElement.textContent = this.iconElement.textContent;
		}
	}
	get name() {
		return this[_name];
	}
	set name(value) {
		const oldName = this.name;
		const typeDir = this.type === "/";
		const slashIndex = (this[_name] = value).lastIndexOf("/");
		this.nameElement.textContent = this.nameElement.title = slashIndex === -1 ? value : value.slice(slashIndex + 1);
		this.element.href = typeDir ? `#${value}` : (this.url = `https://pipe.miroware.io/${Miro.data.user.id}/${encodeForPipe(value)}`);
		this.updateThumbnail();
		this.moving = true;
		if (oldName) {
			const pathIndex = cachedPaths.indexOf(oldName);
			const noPathIndex = pathIndex === -1;
			if (typeDir) {
				if (!noPathIndex) {
					cachedPaths.splice(pathIndex, 1, value);
				}
				const prefix = `${oldName}/`;
				for (const item of pipe) {
					if (item.testPath(prefix)) {
						item.name = value + item.name.slice(oldName.length);
					}
				}
			}
			if (noPathIndex) {
				let ancestry = "";
				for (const name of oldName.split("/").slice(0, -1)) {
					const item = getItem(ancestry += (ancestry && "/") + name);
					if (item) {
						item.size -= this.size;
					}
				}
				ancestry = "";
				for (const name of value.split("/").slice(0, -1)) {
					const item = getItem(ancestry += (ancestry && "/") + name);
					if (item && !item.moving) {
						item.size += this.size;
					}
				}
			}
		}
		delete this.moving;
	}
	get size() {
		return this[_size];
	}
	set size(value) {
		this.sizeElement.textContent = getSize(this[_size] = value);
		this.sizeElement.title = `${value} B`;
		if (this.element.classList.contains("selected")) {
			updateProperties();
		}
	}
	get type() {
		return this[_type];
	}
	set type(value) {
		const typeDir = (this[_type] = value) === "/";
		this.typeElement.textContent = this.typeElement.title = typeDir ? "" : value;
		this.iconElement.textContent = typeDir ? "folder" : (value.startsWith("image/") ? "image" : (value.startsWith("audio/") ? "audiotrack" : (value.startsWith("video/") ? "movie" : "insert_drive_file")));
		this.element.classList[typeDir ? "add" : "remove"]("typeDir");
		this.element.classList[typeDir ? "remove" : "add"]("typeFile");
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
		if (selectedItem === this.element) {
			selectedItem = null;
		}
		if (focusedItem === this.element) {
			focusedItem = null;
		}
		if (this.type === "/") {
			const pathIndex = cachedPaths.indexOf(this.name);
			if (pathIndex !== -1) {
				cachedPaths.splice(pathIndex, 1);
			}
			const prefix = `${this.name}/`;
			for (let i = pipe.length - 1; i >= 0; i--) {
				const item = pipe[i];
				if (item.testPath(prefix)) {
					item.delete();
				}
			}
		}
		let ancestry = "";
		for (const name of this.name.split("/").slice(0, -1)) {
			const item = getItem(ancestry += (ancestry && "/") + name);
			if (item) {
				item.size -= this.size;
			}
		}
		pipe.splice(pipe.indexOf(this), 1);
	}
	open() {
		if (this.type === "/") {
			location.href = this.element.href;
		} else {
			open(this.element.href);
		}
	}
	testPath(prefix) {
		return this.name.startsWith(prefix) && !this.name.includes("/", prefix.length);
	}
};
const removeItem = itemElement => {
	itemElement.classList.remove("selected");
	itemElement.classList.add("loading");
	Miro.request("DELETE", `/users/${Miro.data.user.id}/pipe/${itemElement._item.id}`).then(Miro.response(() => {
		itemElement._item.delete();
		render();
	}, () => {
		itemElement.classList.remove("loading");
	}));
};
const removeItems = () => {
	const itemElements = items.querySelectorAll(".item.selected");
	if (itemElements.length) {
		if (itemElements.length === 1) {
			const itemElement = itemElements[0];
			new Miro.Dialog("Remove Item", html`
				Are you sure you want to remove <b>$${getName(itemElement._item.name)}</b>?<br>${itemElement._item.type === "/" ? `
				Items inside the directory will also be removed.<br>` : ""}
				This cannot be undone.
			`, ["Yes", "No"]).then(value => {
				if (value === 0) {
					removeItem(itemElement);
				}
			});
		} else {
			const selectedDirs = items.querySelectorAll(".item.typeDir.selected").length;
			new Miro.Dialog("Remove Items", html`
				Are you sure you want to remove all those items?<br>${selectedDirs ? `
				Items inside the ${selectedDirs === 1 ? "directory" : "directories"} will also be removed.<br>` : ""}
				This cannot be undone.
			`, ["Yes", "No"]).then(value => {
				if (value === 0) {
					itemElements.forEach(removeItem);
				}
			});
		}
	}
};
const render = () => {
	while (ancestors.lastChild) {
		ancestors.removeChild(ancestors.lastChild);
	}
	ancestors.appendChild(html`
		<span>
			<span class="separator">/</span>
			<a class="ancestor" href="#">$${Miro.data.user.name}</a>
		</span>
	`);
	if (path) {
		let ancestry = "";
		for (const name of path.split("/")) {
			ancestors.appendChild(html`
				<span>
					<span class="separator">/</span>
					<a class="ancestor" href="#$${ancestry += (ancestry && "/") + name}">$${name}</a>
				</span>
			`);
		}
	}
	const ancestorLinks = ancestors.querySelectorAll(".ancestor");
	ancestorLinks[ancestorLinks.length - 1].removeAttribute("href");
	while (items.lastChild) {
		items.removeChild(items.lastChild);
	}
	if (!(sortValue in sort)) {
		sortValue = SORT_DEFAULT;
	}
	const sortedItems = pipe.filter(currentItems).sort(sort[sortValue]);
	for (const item of reverseValue ? sortedItems.reverse() : sortedItems) {
		items.appendChild(item.element);
	}
	updateProperties();
	resize();
};
const goHome = () => {
	location.hash = "#";
};
const hashChange = () => {
	try {
		path = decodeURI(location.hash.slice(1));
	} catch (err) {
		new Miro.Dialog("Error", "The path is malformed.");
		goHome();
		return;
	}
	if (!cachedPaths.includes(path)) {
		Miro.request("GET", `/users/${Miro.data.user.id}/pipe?path=${encodeForPipe(path)}`).then(Miro.response(xhr => {
			for (const item of xhr.response) {
				setItem(new PipeItem(item));
			}
			cachedPaths.push(path);
			render();
		}, goHome));
	} else {
		render();
	}
};
hashChange();
window.addEventListener("hashchange", hashChange);
let selectedItem = null;
let focusedItem = null;
const selectItem = (target, evt, button) => {
	const apparentTop = target.offsetTop - header.offsetHeight;
	if (apparentTop < items.parentNode.scrollTop) {
		items.parentNode.scrollTop = apparentTop;
	} else if (target.offsetTop + target.offsetHeight > items.parentNode.scrollTop + items.parentNode.offsetHeight) {
		items.parentNode.scrollTop = target.offsetTop + target.offsetHeight - items.parentNode.offsetHeight;
	}
	const superKey = evt.ctrlKey || evt.metaKey;
	if (button === 2 && !(superKey || evt.shiftKey)) {
		if (!target.classList.contains("selected")) {
			for (const item of items.querySelectorAll(".item.selected")) {
				item.classList.remove("selected");
			}
			target.classList.add("selected");
			selectedItem = focusedItem = target;
		}
	} else if (evt.shiftKey) {
		let selecting = !selectedItem;
		const classListMethod = superKey && selectedItem && !selectedItem.classList.contains("selected") ? "remove" : "add";
		for (const itemElement of items.querySelectorAll(".item")) {
			if (itemElement === selectedItem || itemElement === target) {
				if (selecting) {
					itemElement.classList[classListMethod]("selected");
					selecting = false;
					continue;
				} else {
					itemElement.classList[classListMethod]("selected");
					if (selectedItem !== target) {
						selecting = true;
					}
				}
			} else if (selecting) {
				itemElement.classList[classListMethod]("selected");
			} else if (!superKey) {
				itemElement.classList.remove("selected");
			}
		}
	} else {
		selectedItem = target;
		focusedItem = target;
		if (superKey) {
			target.classList.toggle("selected");
		} else {
			let othersSelected = false;
			for (const itemElement of items.querySelectorAll(".item.selected")) {
				if (itemElement !== target) {
					othersSelected = true;
					itemElement.classList.remove("selected");
				}
			}
			if (target.classList[othersSelected ? "add" : "toggle"]("selected") === false) {
				selectedItem = null;
			}
		}
	}
	updateProperties();
};
const deselectItems = () => {
	for (const item of items.querySelectorAll(".item.selected")) {
		item.classList.remove("selected");
	}
	selectedItem = focusedItem = null;
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
	indicateTarget();
	if (evt.button !== 0 && evt.button !== 2) {
		return;
	}
	mouseTarget = evt.target;
	mouseDown = evt.button;
	if (evt.target.parentNode._item) {
		focusedItem = evt.target.parentNode;
	} else if (evt.target._item) {
		focusedItem = evt.target;
	}
	indicateTarget();
}, {
	capture: true,
	passive: true
});
document.addEventListener("mouseup", evt => {
	if (mouseDown !== -1 && items.contains(mouseTarget)) {
		if (mouseTarget.parentNode._item || mouseTarget._item) {
			if (mouseMoved) {
				if (indicatedTarget) {
					const sourcePath = path;
					for (const itemElement of items.querySelectorAll(".item.selected")) {
						itemElement.classList.remove("selected");
						itemElement.classList.add("loading");
						const targetName = getTargetName();
						const name = getName(itemElement._item.name);
						Miro.request("PUT", `/users/${Miro.data.user.id}/pipe/${itemElement._item.id}`, {}, {
							name: applyPath(name, targetName)
						}).then(Miro.response(xhr => {
							itemElement._item.name = xhr.response.name;
							itemElement.classList.remove("loading");
							if (sourcePath === path) {
								render();
							}
						}, () => {
							itemElement.classList.remove("loading");
							updateProperties();
						}));
					}
					indicateTarget();
				}
			} else {
				selectItem(mouseTarget.parentNode._item ? mouseTarget.parentNode : mouseTarget, evt, evt.button);
			}
		} else if (mouseTarget.parentNode.parentNode._item) {
			selectItem(mouseTarget.parentNode.parentNode, {
				ctrlKey: true
			});
		} else {
			deselectItems();
		}
	}
	mouseTarget = null;
	mouseDown = -1;
}, {
	capture: true,
	passive: true
});
document.addEventListener("dblclick", evt => {
	if (!mouseMoved && evt.target.parentNode._item) {
		selectItem(evt.target.parentNode, evt, 2);
		evt.target.parentNode._item.open();
	}
}, {
	capture: true,
	passive: true
});
document.addEventListener("mousemove", evt => {
	if (evt.clientX === mouseX && evt.clientY === mouseY) {
		return;
	}
	mouseX = evt.clientX;
	mouseY = evt.clientY;
	if (mouseDown !== -1 && mouseTarget && (mouseTarget.parentNode._item || mouseTarget._item)) {
		if (!mouseMoved) {
			selectItem(mouseTarget.parentNode._item ? mouseTarget.parentNode : mouseTarget, evt, 2);
		}
		if (Miro.data.isMe) {
			indicateTarget(evt.target.classList.contains("ancestor") && evt.target.href ? evt.target : evt.target.parentNode._item && evt.target.parentNode._item.type === "/" && !evt.target.parentNode.classList.contains("selected") && !evt.target.parentNode.classList.contains("loading") && evt.target.parentNode);
		}
	}
	mouseMoved = true;
}, {
	capture: true,
	passive: true
});
const properties = document.body.querySelector("#properties");
const property = {};
for (const propertyElement of properties.querySelectorAll("[data-key]")) {
	(property[propertyElement.getAttribute("data-key")] = propertyElement)._label = propertyElement.querySelector("label");
}
const selectionLength = properties.querySelector("#selectionLength");
const selectionSize = properties.querySelector("#selectionSize");
const linkPreview = property.url.querySelector("#linkPreview");
const privateOption = properties.elements.privacy.options[2];
const save = property.actions.querySelector("#save");
const download = property.actions.querySelector("#download");
const embed = property.actions.querySelector("#embed");
const previewImage = properties.querySelector("#previewImage");
const previewAudio = properties.querySelector("#previewAudio");
const previewVideo = properties.querySelector("#previewVideo");
const showProperty = key => {
	property[key].classList.remove("hidden");
	const input = properties.elements[key];
	input.type = input._type;
};
const sizeReducer = (size, itemElement) => size + itemElement._item.size;
const updateProperties = () => {
	for (const propertyElement of Object.values(property)) {
		propertyElement.classList.add("hidden");
	}
	for (const input of properties.elements) {
		if (input._type) {
			input.type = "hidden";
		}
	}
	save.classList.add("hidden");
	download.classList.add("hidden");
	embed.classList.add("hidden");
	previewImage.src = "";
	previewAudio.src = "";
	previewVideo.src = "";
	const selected = items.querySelectorAll(".item.selected");
	if (selectionLength.textContent = selected.length) {
		property.actions.classList.remove("hidden");
		selectionSize.textContent = getSize(Array.prototype.reduce.call(selected, sizeReducer, 0));
		if (selected.length === 1) {
			const item = selected[0]._item;
			properties.elements.name._prev = properties.elements.name.value = getName(item.name);
			showProperty("name");
			properties.elements.name.parentNode.classList.remove("mdc-text-field--invalid");
			property.name._label.classList.add("mdc-floating-label--float-above");
			const url = item.type === "/" ? `https://pipe.miroware.io/${Miro.data.user.id}/${encodeForPipe(item.name)}` : item.url;
			properties.elements.url._prev = properties.elements.url.value = linkPreview.href = url;
			property.url.classList.remove("hidden");
			properties.elements.url.parentNode.classList.remove("mdc-text-field--invalid");
			property.url._label.classList.add("mdc-floating-label--float-above");
			download.href = `${url}?download`;
			download.classList.remove("hidden");
			if (item.type === "/") {
				property.note.classList.remove("hidden");
			} else {
				properties.elements.type._prev = properties.elements.type.value = item.type;
				showProperty("type");
				properties.elements.type.parentNode.classList.remove("mdc-text-field--invalid");
				property.type._label.classList.add("mdc-floating-label--float-above");
				let showEmbedAction = true;
				if (item.type.startsWith("image/")) {
					previewImage.src = item.url;
					previewImage.classList.remove("hidden");
					previewAudio.classList.add("hidden");
					previewVideo.classList.add("hidden");
					property.preview.classList.remove("hidden");
				} else if (item.type.startsWith("audio/")) {
					previewImage.classList.add("hidden");
					previewAudio.src = item.url;
					previewAudio.classList.remove("hidden");
					previewVideo.classList.add("hidden");
					property.preview.classList.remove("hidden");
				} else if (item.type.startsWith("video/")) {
					previewImage.classList.add("hidden");
					previewAudio.classList.add("hidden");
					previewVideo.src = item.url;
					previewVideo.classList.remove("hidden");
					property.preview.classList.remove("hidden");
				} else if (item.type !== "text/html") {
					showEmbedAction = false;
				}
				if (showEmbedAction) {
					embed.classList.remove("hidden");
				}
			}
		}
		if (Miro.data.isMe) {
			const privacy = selected[0]._item.privacy;
			properties.elements.privacy._prev = properties.elements.privacy.value = Array.prototype.every.call(selected, itemElement => privacy === itemElement._item.privacy) ? String(privacy) : "";
			privateOption.disabled = privateOption.hidden = !!items.querySelector(".item.typeFile.selected");
			property.privacy.classList.remove("hidden");
			save.disabled = true;
			save.classList.remove("hidden");
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
embed.addEventListener("click", () => {
	const item = items.querySelector(".item.selected")._item;
	const embedPreview = html`<div id="embedPreview"></div>`;
	const embedProperties = html`<div id="embedProperties"></div>`;
	let embed;
	const typeAudio = item.type.startsWith("audio/");
	const typeVideo = item.type.startsWith("video/");
	const typeMedia = typeAudio || typeVideo;
	if (typeMedia) {
		embedProperties.appendChild(html`
			<div class="mdc-form-field margined">
				<div class="mdc-checkbox">
					<input id="controls" class="mdc-checkbox__native-control" type="checkbox" checked>
					<div class="mdc-checkbox__background"></div>
				</div>
				<label for="controls">Controls</label>
			</div><br>
			<div id="controlsList">
				<div class="mdc-form-field">
					<div class="mdc-checkbox">
						<input id="nodownload" class="mdc-checkbox__native-control" type="checkbox" checked>
						<div class="mdc-checkbox__background"></div>
					</div>
					<label for="nodownload">Disable download</label>
				</div><br>
				<div class="mdc-form-field">
					<div class="mdc-checkbox">
						<input id="noremoteplayback" class="mdc-checkbox__native-control" type="checkbox">
						<div class="mdc-checkbox__background"></div>
					</div>
					<label for="noremoteplayback">Disable remote playback</label>
				</div><br>
			</div>
			<div class="mdc-form-field">
				<div class="mdc-checkbox">
					<input id="loop" class="mdc-checkbox__native-control" type="checkbox">
					<div class="mdc-checkbox__background"></div>
				</div>
				<label for="loop">Loop</label>
			</div><br>
			<div class="mdc-form-field" title="Some browsers may not autoplay media unless it is also muted.">
				<div class="mdc-checkbox">
					<input id="autoplay" class="mdc-checkbox__native-control" type="checkbox">
					<div class="mdc-checkbox__background"></div>
				</div>
				<label for="autoplay">Autoplay</label>
			</div><br>
			<div class="mdc-form-field">
				<div class="mdc-checkbox">
					<input id="muted" class="mdc-checkbox__native-control" type="checkbox">
					<div class="mdc-checkbox__background"></div>
				</div>
				<label for="muted">Muted</label>
			</div><br>
		`);
		const input = evt => {
			if (embed[evt.target.id] = evt.target.checked) {
				embed.setAttribute(evt.target.id, "");
			} else {
				embed.removeAttribute(evt.target.id);
			}
			updateCode();
		};
		const controlsList = embedProperties.querySelector("#controlsList");
		const noDownload = controlsList.querySelector("#nodownload");
		const noRemotePlayback = controlsList.querySelector("#noremoteplayback");
		let noFullscreen;
		embedProperties.querySelector("#controls").addEventListener("input", evt => {
			if (evt.target.checked) {
				controlsList.classList.remove("hidden");
				if (noDownload.checked) {
					embed.controlsList.add("nodownload");
				}
				if (noRemotePlayback.checked) {
					embed.controlsList.add("noremoteplayback");
				}
				if (noFullscreen && noFullscreen.checked) {
					embed.controlsList.add("nofullscreen");
				}
			} else {
				controlsList.classList.add("hidden");
				embed.removeAttribute("controlslist");
			}
			input(evt);
		});
		embedProperties.querySelector("#loop").addEventListener("input", input);
		embedProperties.querySelector("#autoplay").addEventListener("input", input);
		embedProperties.querySelector("#muted").addEventListener("input", input);
		const inputControls = evt => {
			if (evt.target.checked) {
				embed.controlsList.add(evt.target.id);
			} else {
				embed.controlsList.remove(evt.target.id);
				if (!embed.controlsList.length) {
					embed.removeAttribute("controlslist");
				}
			}
			updateCode();
		};
		noDownload.addEventListener("input", inputControls);
		noRemotePlayback.addEventListener("input", inputControls);
		if (typeAudio) {
			embed = document.createElement("audio");
		} else {
			embed = document.createElement("video");
			controlsList.appendChild(html`
				<div class="mdc-form-field">
					<div class="mdc-checkbox">
						<input id="nofullscreen" class="mdc-checkbox__native-control" type="checkbox">
						<div class="mdc-checkbox__background"></div>
					</div>
					<label for="nofullscreen">Disable fullscreen</label>
				</div><br>
			`);
			(noFullscreen = controlsList.querySelector("#nofullscreen")).addEventListener("input", inputControls);
		}
		embed.controls = true;
		embed.controlsList.add("nodownload");
	}
	if (!typeAudio) {
		embedProperties.insertBefore(html`
			<div class="mdc-text-field margined">
				<input id="width" class="mdc-text-field__input" type="number" min="0">
				<label class="mdc-floating-label" for="width">Width</label>
				<div class="mdc-line-ripple"></div>
			</div><br>
			<div class="mdc-text-field">
				<input id="height" class="mdc-text-field__input" type="number" min="0">
				<label class="mdc-floating-label" for="height">Height</label>
				<div class="mdc-line-ripple"></div>
			</div><br>
		`, embedProperties.firstChild);
		const input = evt => {
			if (evt.target.checkValidity()) {
				if (evt.target.value) {
					embed[evt.target.id] = evt.target.value;
				} else {
					embed.removeAttribute(evt.target.id);
				}
				updateCode();
			}
		};
		embedProperties.querySelector("#width").addEventListener("input", input);
		embedProperties.querySelector("#height").addEventListener("input", input);
		if (item.type.startsWith("image/")) {
			embed = document.createElement("img");
		} else if (item.type === "text/html") {
			embed = html`<iframe style="border: 0;"></iframe>`;
		}
	}
	embed.src = item.url;
	const codeField = html`
		<div class="mdc-text-field mdc-text-field--textarea">
			<textarea id="code" class="mdc-text-field__input" title="Click to copy" rows="4" cols="64" readonly></textarea>
			<label class="mdc-floating-label" for="code">HTML Code</label>
		</div>
	`;
	const code = codeField.querySelector("#code");
	code.addEventListener("click", () => {
		code.select();
		document.execCommand("copy");
		Miro.snackbar("Copied code to clipboard");
	});
	const emptyValues = /=""/g;
	const updateCode = () => {
		code.value = embed.outerHTML.replace(emptyValues, "");
	};
	updateCode();
	embedPreview.appendChild(embed);
	new Miro.Dialog("Embed", embedPreview).element.classList.add("embedDialog");
	embedPreview.parentNode.appendChild(embedProperties);
	embedProperties.insertBefore(codeField, embedProperties.firstChild);
});
updateProperties();
if (Miro.data.isMe) {
	const checkName = async (name, parent = path) => {
		let takenItem;
		let fullName = applyPath(name, parent);
		while (takenItem = getItem(fullName)) {
			const value = await new Miro.Dialog("Error", html`
				<b>$${fullName}</b> already exists.
			`, ["Replace", "Rename", "Cancel"]);
			if (value === 0) {
				if (await new Miro.Dialog("Replace", html`
					Are you sure you want to replace <b>$${fullName}</b>?
				`, ["Yes", "No"]) === 0) {
					Miro.response(() => {
						takenItem.delete();
						render();
					})(await Miro.request("DELETE", `/users/${Miro.data.user.id}/pipe/${takenItem.id}`));
				}
			} else if (value === 1) {
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
				if (await dialog === 0) {
					name = dialog.form.elements.name.value;
				}
			} else {
				return false;
			}
			fullName = applyPath(name, parent);
		}
		return name;
	};
	const creation = container.querySelector("#creation");
	const queuedItems = container.querySelector("#queuedItems");
	const queue = [];
	const queueReducer = (progress, item) => {
		progress.loaded += item.loaded;
		progress.total += item.file.size;
		return progress;
	};
	const updateQueue = () => {
		if (!queue.length) {
			creation.classList.remove("loading");
			return;
		}
		const {loaded, total} = queue.reduce(queueReducer, {
			loaded: 0,
			total: 0
		});
		const done = loaded === total;
		if (done) {
			creation.classList.remove("loading");
			queue.length = 0;
		} else {
			creation.classList.add("loading");
			creation.style.backgroundSize = `${100 * (done ? 1 : loaded / total)}%`;
		}
	};
	window.onbeforeunload = () => container.querySelector(".loading") || !save.disabled || undefined;
	const PipeFile = class PipeFile {
		constructor(file, name, parent = path) {
			this.file = file;
			this.name = name || file.name;
			const fullName = applyPath(this.name, this.path = parent);
			this.element = html`
				<a class="item loading" draggable="false" ondragstart="return false;">
					<div class="label">
						<div class="title" title="$${this.name}">$${this.name}</div>
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
					name: fullName
				})
			}, this.file, xhr => {
				this.xhr = xhr;
				this.loaded = 0;
				this.xhr.upload.addEventListener("progress", evt => {
					if (this.xhr.readyState !== XMLHttpRequest.DONE) {
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
				const item = setItem(new PipeItem(xhr.response));
				selectItem(item.element, {
					ctrlKey: true
				});
				let ancestry = "";
				for (const name of this.path.split("/")) {
					const ancestorItem = getItem(ancestry += (ancestry && "/") + name);
					if (ancestorItem) {
						ancestorItem.size += item.size;
					}
				}
				if (path === this.path) {
					render();
				}
			}, (xhr, error) => {
				this.element.classList.remove("loading");
				this.element.classList.add("error");
				this.subtitleElement.title = error;
				this.subtitleElement.textContent = "An error occurred. Click to retry.";
				this.element.addEventListener("click", this.retry.bind(this));
				if (this.dequeue()) {
					updateQueue();
				}
			}));
		}
		dequeue() {
			const queueIndex = queue.indexOf(this);
			if (queueIndex === -1) {
				return false;
			} else {
				queue.splice(queueIndex, 1);
				return true;
			}
		}
		async close(evt) {
			if (evt instanceof Event) {
				evt.preventDefault();
			}
			if (this.element.classList.contains("loading") && await new Miro.Dialog("Cancel", html`
				Are you sure you want to cancel uploading <b>$${this.name}</b>?
			`, ["Yes", "No"]) !== 0) {
				return;
			}
			if (this.element.parentNode) {
				this.xhr.abort();
				this.element.parentNode.removeChild(this.element);
				if (this.dequeue()) {
					updateQueue();
				}
			}
		}
		retry(evt) {
			if (!this.closeElement.contains(evt.target)) {
				this.element.parentNode.replaceChild(new PipeFile(this.file).element, this.element);
				this.dequeue();
			}
		}
	};
	const addFile = async (file, name, parent) => {
		if (!(name = await checkName(typeof name === "string" ? name : file.name, parent))) {
			return;
		}
		queuedItems.appendChild(new PipeFile(file, name, parent).element);
	};
	const addURL = async (url, parent) => {
		let name = decodeURI(url);
		name = name.slice(name.lastIndexOf("/"));
		const queryIndex = name.indexOf("?");
		if (queryIndex !== -1) {
			name = name.slice(0, queryIndex);
		}
		if (!(name = await checkName(await enterName(name), parent))) {
			return;
		}
		/*
		const file = ;
		queuedItems.appendChild(new PipeFile(file, name, parent).element);
		*/
		new Miro.Dialog("Error", "URL uploads aren't supported yet. Try again soon!");
	};
	const fileInput = document.createElement("input");
	fileInput.type = "file";
	fileInput.multiple = true;
	fileInput.addEventListener("change", () => {
		for (const file of fileInput.files) {
			addFile(file);
		}
		fileInput.value = null;
	});
	creation.querySelector("#addFiles").addEventListener("click", fileInput.click.bind(fileInput));
	const PipeDirectory = class PipeDirectory {
		constructor(name) {
			this.path = path;
			this.name = name;
			Miro.request("POST", `/users/${Miro.data.user.id}/pipe`, {
				"X-Data": JSON.stringify({
					name: applyPath(this.name),
					type: "/"
				})
			}).then(Miro.response(xhr => {
				selectItem(setItem(new PipeItem(xhr.response)).element, {
					ctrlKey: true
				});
				cachedPaths.push(xhr.response.name);
				if (path === this.path) {
					render();
				}
			}));
		}
	};
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
			if (value === 0) {
				const name = await checkName(dialog.form.elements.name.value);
				if (!name) {
					return;
				}
				new PipeDirectory(name);
			}
		});
	});
	const enterName = async name => await new Promise(async resolve => {
		const dialog = new Miro.Dialog("Paste", html`
			Enter a file name.<br>
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
		if (await dialog === 0) {
			name = dialog.form.elements.name.value;
		} else {
			return;
		}
		resolve(name);
	});
	const htmlFilenameTest = /\/([^\/]+?)"/;
	document.addEventListener("paste", async evt => {
		if (Miro.focused() && !Miro.typing() && evt.clipboardData.items.length) {
			let file;
			let htmlString;
			let string;
			for (const dataTransferItem of evt.clipboardData.items) {
				if (dataTransferItem.kind === "file") {
					file = dataTransferItem;
				} else if (dataTransferItem.kind === "string") {
					if (dataTransferItem.type === "text/html") {
						htmlString = dataTransferItem;
					} else if (dataTransferItem.type === "text/plain") {
						string = dataTransferItem;
					}
				}
			}
			if (file) {
				let name = (file = file.getAsFile()).name;
				if (htmlString) {
					const htmlFilename = (await new Promise(htmlString.getAsString.bind(htmlString))).match(htmlFilenameTest);
					name = htmlFilename ? htmlFilename[1] : "file";
				}
				addFile(file, await enterName(name));
			} else if (string) {
				string = await new Promise(htmlString.getAsString.bind(htmlString));
				if (string.includes("://") && string === encodeURI(string)) {
					addURL(string);
				}
			}
		}
	}, {
		capture: true,
		passive: true
	});
	let allowDrop = true;
	document.addEventListener("dragstart", evt => {
		allowDrop = false; // This prevents things on the page from being dropped to the same page.
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
		if (dragLeaveTimeout) {
			clearTimeout(dragLeaveTimeout);
			dragLeaveTimeout = null;
		}
		if (allowDrop && Miro.focused() && (evt.dataTransfer.types.includes("Files") || evt.dataTransfer.types.includes("text/uri-list"))) {
			if (items.contains(evt.target)) {
				for (const itemElement of items.querySelectorAll(".item.typeDir")) {
					if (itemElement.contains(evt.target)) {
						indicateTarget(itemElement);
						return;
					}
				}
			} else if (evt.target.classList.contains("ancestor")) {
				indicateTarget(evt.target);
				return;
			}
			indicateTarget(container);
		}
	}, true);
	document.addEventListener("dragleave", () => {
		if (dragLeaveTimeout) {
			clearTimeout(dragLeaveTimeout);
		}
		dragLeaveTimeout = setTimeout(indicateTarget, 100);
	}, {
		capture: true,
		passive: true
	});
	document.addEventListener("drop", evt => {
		evt.preventDefault();
		if (allowDrop && Miro.focused()) {
			const targetName = getTargetName();
			if (evt.dataTransfer.files.length) {
				for (const file of evt.dataTransfer.files) {
					addFile(file, undefined, targetName);
				}
			} else if (evt.dataTransfer.types.includes("text/uri-list")) {
				addURL(evt.dataTransfer.getData("text/uri-list"), targetName);
			}
			indicateTarget();
		}
	}, true);
	property.actions.querySelector("#delete").addEventListener("click", removeItems);
	for (const input of properties.elements) {
		const instanceInput = input instanceof HTMLInputElement;
		input._input = instanceInput || input instanceof HTMLSelectElement;
		if (instanceInput && !input.readOnly) {
			input._type = input.type;
		}
	}
	const changed = [];
	const onInput = evt => {
		changed.length = 0;
		for (const input of properties.elements) {
			if (input._input && input.type !== "hidden") {
				if (input.checkValidity()) {
					if (input._prev !== Miro.value(input)) {
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
	properties.addEventListener("submit", async evt => {
		evt.preventDefault();
		Miro.formState(properties, false);
		const changedName = changed.includes(properties.elements.name);
		if (changedName) {
			let name = await checkName(properties.elements.name.value);
			if (!name) {
				Miro.formState(properties, true);
				return;
			}
			properties.elements.name.value = name;
		}
		const changedType = changed.includes(properties.elements.type);
		const changedPrivacy = changed.includes(properties.elements.privacy);
		const selected = items.querySelectorAll(".item.selected");
		let responses = 0;
		const countResponse = () => {
			if (++responses === selected.length) {
				Miro.formState(properties, true);
			}
		};
		let noFailure = true;
		for (const itemElement of selected) {
			itemElement.classList.remove("selected");
			itemElement.classList.add("loading");
			const data = {};
			if (changedName) {
				data.name = applyPath(properties.elements.name.value);
			}
			if (changedType) {
				data.type = properties.elements.type.value;
			}
			if (changedPrivacy) {
				data.privacy = +properties.elements.privacy.value;
			}
			Miro.request("PUT", `/users/${Miro.data.user.id}/pipe/${itemElement._item.id}`, {}, data).then(Miro.response(async xhr => {
				if (changedName) {
					itemElement._item.name = xhr.response.name;
				}
				if (changedType) {
					itemElement._item.type = xhr.response.type;
				}
				if (changedPrivacy) {
					itemElement._item.privacy = xhr.response.privacy;
				}
				if (noFailure) {
					save.disabled = true;
				}
				itemElement.classList.remove("loading");
				itemElement.classList.add("selected");
				await Miro.wait();
				if (itemElement._item.testPath(path ? `${path}/` : "")) {
					render();
				}
			}, () => {
				noFailure = false;
				save.disabled = false;
				itemElement.classList.remove("loading");
				itemElement.classList.add("selected");
				if (itemElement._item.testPath(path ? `${path}/` : "")) {
					updateProperties();
				}
			})).then(countResponse);
		}
	});
}
document.addEventListener("keydown", evt => {
	if (!Miro.typing() && Miro.focused()) {
		const superKey = evt.ctrlKey || evt.metaKey;
		if (evt.keyCode === 8 || evt.keyCode === 46) { // `backspace` || `delete`
			if (Miro.data.isMe) {
				removeItems();
			}
		} else if (evt.keyCode === 13) { // `enter`
			evt.preventDefault();
			const itemElement = items.querySelector(".item.selected");
			if (itemElement) {
				itemElement._item.open();
			}
		} else if (evt.keyCode === 27) { // `esc`
			deselectItems();
		} else if (evt.keyCode === 35) { // `end`
			evt.preventDefault();
			if (items.lastChild) {
				focusedItem = items.lastChild;
				if (evt.shiftKey || !superKey) {
					selectItem(items.lastChild, evt);
				}
			}
		} else if (evt.keyCode === 36) { // `home`
			evt.preventDefault();
			if (items.firstChild) {
				focusedItem = items.firstChild;
				if (evt.shiftKey || !superKey) {
					selectItem(items.firstChild, evt);
				}
			}
		} else if (evt.keyCode === 37 || evt.keyCode === 38) { // `left` || `up`
			evt.preventDefault();
			const item = focusedItem ? focusedItem.previousSibling || items.lastChild : items.firstChild;
			if (item) {
				focusedItem = item;
				if (evt.shiftKey || !superKey) {
					selectItem(item, evt);
				}
			}
		} else if (evt.keyCode === 39 || evt.keyCode === 40) { // `right` || `down`
			evt.preventDefault();
			const item = focusedItem ? focusedItem.nextSibling || items.firstChild : items.firstChild;
			if (item) {
				focusedItem = item;
				if (evt.shiftKey || !superKey) {
					selectItem(item, evt);
				}
			}
		} else if (evt.keyCode === 65) { // ^`A`
			evt.preventDefault();
			for (const item of items.querySelectorAll(".item:not(.selected)")) {
				item.classList.add("selected");
			}
			updateProperties();
		}
	}
}, true);
const viewMode = header.querySelector("#viewMode");
let viewValue = +localStorage.pipe_viewMode || 0;
const updateViewMode = () => {
	if (viewValue) {
		items.classList.add("tiles");
		viewMode.title = "List view";
		viewMode.textContent = "view_list";
	} else {
		items.classList.remove("tiles");
		viewMode.title = "Tile view";
		viewMode.textContent = "view_module";
	}
	resize();
};
viewMode.addEventListener("click", () => {
	localStorage.pipe_viewMode = viewValue = (viewValue + 1) % 2;
	updateViewMode();
});
const resize = () => {
	indicateTarget();
	if (viewValue) {
		for (const itemElement of items.querySelectorAll(".item")) {
			if (itemElement._item.thumbnailHidden && itemElement.offsetTop + itemElement.offsetHeight > items.parentNode.scrollTop + header.offsetHeight && itemElement.offsetTop - items.parentNode.scrollTop < items.parentNode.offsetHeight) {
				itemElement.insertBefore(itemElement._item.thumbnailElement, itemElement.firstChild);
				itemElement._item.thumbnailHidden = false;
			}
		}
	}
};
items.parentNode.addEventListener("scroll", resize, {
	passive: true
});
window.addEventListener("resize", resize);
updateViewMode();
