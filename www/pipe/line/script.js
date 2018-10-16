"use strict";
const page = document.body.querySelector("main");
const items = page.querySelector("#items");
let parent = "";
const getName = name => parent ? name.slice(parent.length + 1) : name;
const applyParent = name => parent ? `${parent}/${name}` : name;
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
const getDate = date => new Date(date).toString().split(" ").slice(1, 5).join(" ");
const getURL = item => `https://pipe.miroware.io/${Miro.data.user}/${encodeURI(item.name)}`;
const getItemElement = item => {
	if(item.element) {
		return item.element;
	} else {
		const name = getName(item.name);
		const date = new Date(item.date);
		const itemElement = item.type === "/" ? html`
			<a class="tr item typeDir" href="#$${name}">
				<div class="td iconData">
					<i class="material-icons">folder</i>
				</div>
				<div class="td nameData" title="$${name}">$${name}</div>
				<div class="td sizeData">-</div>
				<div class="td typeData">-</div>
				<div class="td dateData" title="$${date}">$${getDate(date)}</div>
			</a>
		` : html`
			<a class="tr item typeFile" href="$${getURL(item)}" target="_blank">
				<div class="td iconData">
					<i class="material-icons">insert_drive_file</i>
				</div>
				<div class="td nameData" title="$${name}">$${name}</div>
				<div class="td sizeData" title="${item.size} B">${getSize(item.size)}</div>
				<div class="td typeData" title="$${item.type}">$${item.type}</div>
				<div class="td dateData" title="$${date}">$${getDate(date)}</div>
			</a>
		`;
		(item.element = itemElement)._item = item;
		return itemElement;
	}
};
const path = page.querySelector("#path");
const itemsToRender = item => (!parent && !item.name.includes("/")) || item.name.slice(parent.length).lastIndexOf("/") === 0;
const sort = {
	name: (a, b) => {
		const stringA = a.name.toLowerCase();
		const stringB = b.name.toLowerCase();
		return stringA < stringB ? 1 : -1;
	},
	size: (a, b) => ((a.size || Infinity) - (b.size || Infinity)) || a.date - b.date,
	type: (a, b) => a.type < b.type ? 1 : (a.type > b.type ? -1 : a.date - b.date),
	date: (a, b) => a.date - b.date
};
const render = () => {
	while(path.lastChild) {
		path.removeChild(path.lastChild);
	}
	path.appendChild(html`
		<span>
			/ <a class="pathLink" href="#">${Miro.data.user}</a>
		</span>
	`);
	if(parent) {
		let hashSum = "";
		for(const name of parent.split("/")) {
			hashSum += `${name}/`;
			path.appendChild(html`
				<span>
					/ <a class="pathLink" href="#$${hashSum.slice(0, -1)}">$${name}</a>
				</span>
			`);
		}
	}
	const pathLinks = path.querySelectorAll(".pathLink");
	pathLinks[pathLinks.length - 1].removeAttribute("href");
	const loading = items.querySelectorAll(".item.loading");
	while(items.lastChild) {
		items.removeChild(items.lastChild);
	}
	if(!(localStorage.pipe_sortItems in sort)) {
		localStorage.pipe_sortItems = "type";
	}
	const reverseItems = +localStorage.pipe_reverseItems;
	sortIcon.classList[reverseItems ? "add" : "remove"]("reverse");
	heads.querySelector(`.head[data-sort="${localStorage.pipe_sortItems}"]`).appendChild(sortIcon);
	const itemArray = Miro.data.pipe.filter(itemsToRender).sort(sort[localStorage.pipe_sortItems]);
	for(const item of reverseItems ? itemArray.reverse() : itemArray) {
		items.insertBefore(getItemElement(item), items.firstChild);
	}
	for(const itemElement of loading) {
		if(!itemElement.parentNode) {
			items.insertBefore(itemElement, items.firstChild);
		}
	}
	updateSelection();
};
const byName = item => item.name;
const checkName = async name => {
	const names = Miro.data.pipe.map(byName);
	while(names.includes(applyParent(name))) {
		const dialog = new Miro.Dialog("Rename", html`
			The name specified for <b>$${name}</b> is already taken. Please enter a new one.<br>
			<div class="mdc-text-field">
				<input name="name" class="mdc-text-field__input" type="text" value="$${name}" maxlength="255" size="24" pattern="^[^/]+$" autocomplete="off" spellcheck="false" required>
				<div class="mdc-line-ripple"></div>
			</div>
		`, [{
			text: "Okay",
			type: "submit"
		}, "Cancel"]);
		name = await dialog === 0 ? dialog.form.elements.name.value : null;
	}
	return name;
};
const addFile = async file => {
	const name = await checkName(file.name);
	if(!name) {
		return;
	}
	const fileSize = getSize(file.size);
	const itemElement = html`
		<a class="tr item typeFile loading" target="_blank">
			<div class="td iconData">
				<i class="material-icons">insert_drive_file</i>
			</div>
			<div class="td nameData" title="$${name}">$${name}</div>
			<div class="td sizeData" title="- / ${file.size} B">- / ${fileSize}</div>
			<div class="td typeData">-</div>
			<div class="td dateData">-</div>
		</a>
	`;
	itemElement._item = file;
	const sizeData = itemElement.querySelector(".sizeData");
	const typeData = itemElement.querySelector(".typeData");
	const dateData = itemElement.querySelector(".dateData");
	items.insertBefore(itemElement, items.firstChild);
	Miro.request("POST", "/users/@me/pipe", {
		"Content-Type": "application/octet-stream",
		"X-Data": JSON.stringify({
			name: applyParent(name)
		})
	}, file, xhr => {
		itemElement._xhr = xhr;
		itemElement._xhr.upload.addEventListener("progress", evt => {
			const percentage = 100 * evt.loaded / evt.total;
			itemElement.style.backgroundSize = `${percentage}%`;
			sizeData.textContent = `${getSize(evt.loaded)} / ${fileSize}`;
			sizeData.title = `${evt.loaded} B / ${evt.total} B`;
			if(percentage === 100) {
				delete itemElement._xhr;
				updateSelection();
			}
		});
	}).then(Miro.response(xhr => {
		Miro.data.pipe.push((xhr.response.element = itemElement)._item = xhr.response);
		itemElement.href = getURL(itemElement._item);
		sizeData.textContent = fileSize;
		sizeData.title = `${file.size} B`;
		typeData.textContent = typeData.title = xhr.response.type;
		const date = new Date(xhr.response.date);
		dateData.textContent = getDate(date);
		dateData.title = date;
		itemElement.classList.remove("loading");
		render();
	}, () => {
		itemElement.parentNode.removeChild(itemElement);
		updateSelection();
	}));
};
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
			indicateTarget(page);
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
		}/* else if(evt.dataTransfer.types.includes("text/uri-list")) {
			addURI(evt.dataTransfer.getData("text/uri-list"));
		}*/
		indicateTarget();
	}
}, true);
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
window.onbeforeunload = () => items.querySelector(".item.loading") || undefined;
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
	updateSelection();
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
	if(evt.target.parentNode.classList.contains("item")) {
		focusedItem = evt.target.parentNode;
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
	if(mouseDown !== -1 && mouseTarget && mouseTarget.parentNode.classList.contains("item")) {
		if(!mouseMoved) {
			selectItem(mouseTarget.parentNode, evt, 2);
		}
		if(!mouseTarget.parentNode.classList.contains("loading")) {
			indicateTarget(evt.target.classList.contains("pathLink") ? evt.target.href && evt.target : evt.target.parentNode.classList.contains("item") && evt.target.parentNode._item.type === "/" && !evt.target.parentNode.classList.contains("selected") && !evt.target.parentNode.classList.contains("loading") && evt.target.parentNode);
		}
	}
	mouseMoved = true;
}, {
	capture: true,
	passive: true
});
document.addEventListener("mouseup", evt => {
	if(mouseDown !== -1 && page.contains(mouseTarget)) {
		if(mouseTarget.parentNode.classList.contains("item")) {
			if(mouseMoved) {
				if(indicatedTarget) {
					for(const itemElement of items.querySelectorAll(".item.selected")) {
						itemElement.classList.remove("selected");
						if(!itemElement.classList.contains("loading")) {
							itemElement.classList.add("loading");
							const targetParent = indicatedTarget.href ? indicatedTarget.href.slice(indicatedTarget.href.indexOf("#") + 1) : indicatedTarget._item.name;
							const name = getName(itemElement._item.name);
							Miro.request("PUT", `/users/@me/pipe/${itemElement._item.id}`, {}, {
								name: targetParent ? `${targetParent}/${name}` : name
							}).then(Miro.response(xhr => {
								if(itemElement._item.type === "/") {
									const prefix = `${itemElement._item.name}/`;
									for(const item of Miro.data.pipe) {
										if(item.name.startsWith(prefix)) {
											item.name = xhr.response.name + item.name.slice(itemElement._item.name.length);
										}
									}
								}
								itemElement._item.name = xhr.response.name;
								itemElement.href = itemElement._item.type === "/" ? `#${itemElement._item.name}` : getURL(itemElement._item);
								itemElement.parentNode.removeChild(itemElement);
								itemElement.classList.remove("loading");
								render();
							}, () => {
								itemElement.classList.remove("loading");
								updateSelection();
							}));
						}
					}
					if(!indicatedTarget.href) {
						indicatedTarget.classList.add("selected");
					}
					indicateTarget();
					updateSelection();
				}
			} else {
				selectItem(mouseTarget.parentNode, evt, evt.button);
			}
		} else if(!mouseMoved) {
			if(mouseTarget.classList.contains("head")) {
				// TODO: Sort items
			} else {
				for(const item of items.querySelectorAll(".item.selected")) {
					item.classList.remove("selected");
				}
				selectedItem = focusedItem = null;
				updateSelection();
			}
		}
	}
	mouseTarget = null;
	mouseDown = -1;
}, {
	capture: true,
	passive: true
});
document.addEventListener("keydown", evt => {
	if(!Miro.typing() && Miro.focused()) {
		const superKey = evt.ctrlKey || evt.metaKey;
		if(evt.keyCode === 8 || evt.keyCode === 46) { // `backspace` || `delete`
			if(!removeButton.classList.contains("mdc-fab--exited")) {
				removeButton.click();
			}
		} else if(evt.keyCode === 13) { // `enter`
			if(!openButton.classList.contains("mdc-fab--exited")) {
				openButton.click();
			}
		} else if(evt.keyCode === 27) { // `esc`
			for(const item of items.querySelectorAll(".item.selected")) {
				item.classList.remove("selected");
			}
			selectedItem = focusedItem = null;
			updateSelection();
		} else if(evt.keyCode === 38) { // `up`
			evt.preventDefault();
			const item = focusedItem ? focusedItem.previousElementSibling || items.lastElementChild : items.firstElementChild;
			if(item) {
				focusedItem = item;
				if(evt.shiftKey || !superKey) {
					selectItem(item, evt);
				}
			}
		} else if(evt.keyCode === 40) { // `down`
			evt.preventDefault();
			const item = focusedItem ? focusedItem.nextElementSibling || items.firstElementChild : items.firstElementChild;
			if(item) {
				focusedItem = item;
				if(evt.shiftKey || !superKey) {
					selectItem(item, evt);
				}
			}
		} else if(evt.keyCode === 65) { // ^`A`
			evt.preventDefault();
			for(const item of items.querySelectorAll(".item:not(.selected)")) {
				item.classList.add("selected");
			}
			updateSelection();
		}
	}
}, true);
document.addEventListener("dblclick", evt => {
	if(!mouseMoved && evt.target.parentNode.classList.contains("item")) {
		selectItem(evt.target.parentNode, evt, 2);
		if(!openButton.classList.contains("mdc-fab--exited")) {
			openButton.click();
		}
	}
}, {
	capture: true,
	passive: true
});
const removeItem = itemElement => {
	itemElement.classList.add("loading");
	const removeItemElement = () => {
		if(selectedItem === itemElement) {
			selectedItem = null;
		}
		if(focusedItem === itemElement) {
			focusedItem = null;
		}
		itemElement.parentNode.removeChild(itemElement);
		Miro.data.pipe.splice(Miro.data.pipe.indexOf(itemElement._item), 1);
		if(itemElement._item.type === "/") {
			const prefix = `${itemElement._item.name}/`;
			Miro.data.pipe = Miro.data.pipe.filter(item => !item.name.startsWith(prefix));
		}
		updateSelection();
	};
	if(itemElement._xhr) {
		itemElement._xhr.abort();
		removeItemElement();
	} else {
		Miro.request("DELETE", `/users/@me/pipe/${itemElement._item.id}`).then(Miro.response(removeItemElement, () => {
			itemElement.classList.remove("loading");
		}));
	}
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
const itemInfo = itemElement => {
	if(itemElement._item.type === "/") {
		const name = getName(itemElement._item.name);
		const dialog = new Miro.Dialog("Item", html`
			<div class="mdc-text-field">
				<input id="name" name="name" class="mdc-text-field__input" type="text" value="$${name}" maxlength="255" size="24" pattern="^[^/]+$" autocomplete="off" required>
				<label class="mdc-floating-label" for="name">Name</label>
				<div class="mdc-line-ripple"></div>
			</div>
		`, [{
			text: "Okay",
			type: "submit"
		}, "Cancel"]).then(async value => {
			if(value === 0 && name !== dialog.form.elements.name.value && (dialog.form.elements.name.value = (await checkName(dialog.form.elements.name.value)))) {
				itemElement.classList.add("loading");
				updateSelection();
				Miro.request("PUT", `/users/@me/pipe/${itemElement._item.id}`, {}, {
					name: applyParent(dialog.form.elements.name.value)
				}).then(Miro.response(xhr => {
					const prefix = `${itemElement._item.name}/`;
					for(const item of Miro.data.pipe) {
						if(item.name.startsWith(prefix)) {
							item.name = xhr.response.name + item.name.slice(itemElement._item.name.length);
						}
					}
					const nameData = itemElement.querySelector(".nameData");
					nameData.textContent = nameData.title = getName(itemElement._item.name = xhr.response.name);
					itemElement.href = `#${itemElement._item.name}`;
					itemElement.classList.remove("loading");
					render();
				}, () => {
					itemElement.classList.remove("loading");
					updateSelection();
				}));
			}
		});
	} else {
		const name = getName(itemElement._item.name);
		const url = getURL(itemElement._item);
		const dialog = new Miro.Dialog("Item", html`
			<div class="mdc-text-field">
				<input id="name" class="mdc-text-field__input" type="text" value="$${name}" maxlength="255" size="24" pattern="^[^/]+$" autocomplete="off" spellcheck="false" required>
				<label class="mdc-floating-label" for="name">Name</label>
				<div class="mdc-line-ripple"></div>
			</div><br>
			<div class="mdc-text-field">
				<input id="type" class="mdc-text-field__input" type="text" value="$${itemElement._item.type}" maxlength="255" size="24" pattern="^[^\\x00-\\x20()<>@,;:\\\\&quot;/[\\]?.=]+/[^\\x00-\\x20()<>@,;:\\\\&quot;/[\\]?.=]+$" spellcheck="false" required>
				<label class="mdc-floating-label" for="type">Type</label>
				<div class="mdc-line-ripple"></div>
			</div><br>
			<div class="mdc-text-field spaced">
				<input id="url" class="mdc-text-field__input" type="url" value="$${url}" size="24" readonly>
				<label class="mdc-floating-label" for="url">URL</label>
				<div class="mdc-line-ripple"></div>
			</div><button class="mdc-icon-button material-icons spaced" type="button" title="Copy URL to clipboard">link</button><br>
			<a href="$${url}" target="_blank">Preview link</a>
		`, [{
			text: "Okay",
			type: "submit"
		}, "Cancel"]).then(async value => {
			if(value === 0) {
				let changedName = name !== dialog.form.elements.name.value;
				if(changedName && !(dialog.form.elements.name.value = await checkName(dialog.form.elements.name.value))) {
					changedName = false;
				}
				const changedType = itemElement._item.type !== dialog.form.elements.type.value;
				if(changedName || changedType) {
					itemElement.classList.add("loading");
					updateSelection();
					const data = {};
					if(changedName) {
						data.name = applyParent(dialog.form.elements.name.value);
					}
					if(changedType) {
						data.type = dialog.form.elements.type.value;
					}
					Miro.request("PUT", `/users/@me/pipe/${itemElement._item.id}`, {}, data).then(Miro.response(xhr => {
						const nameData = itemElement.querySelector(".nameData");
						nameData.textContent = nameData.title = getName(itemElement._item.name = xhr.response.name);
						itemElement.href = getURL(itemElement._item);
						const typeData = itemElement.querySelector(".typeData");
						typeData.textContent = typeData.title = xhr.response.type;
						itemElement.classList.remove("loading");
						render();
					}, () => {
						itemElement.classList.remove("loading");
						updateSelection();
					}));
				}
			}
		});
		dialog.form.querySelector("button").addEventListener("click", () => {
			dialog.form.elements.url.select();
			document.execCommand("copy");
			Miro.snackbar("URL copied to clipboard");
		});
		setTimeout(dialog.form.elements.url.select.bind(dialog.form.elements.url));
	}
};
const itemsInfo = itemElements => {
	let size = 0;
	for(const itemElement of itemElements) {
		if(itemElement._item.type !== "/") {
			size += itemElement._item.size;
		}
	}
	new Miro.Dialog("Items", html`
		Items selected: <b>${itemElements.length}</b><br>
		Total size: <b>${getSize(size)}</b> (<b>${size} B</b>)
	`);
};
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.multiple = true;
fileInput.addEventListener("change", () => {
	Array.prototype.forEach.call(fileInput.files, addFile);
	fileInput.value = null;
});
const addContainer = document.body.querySelector("#addContainer");
const addButton = addContainer.querySelector("#addButton");
addButton.addEventListener("click", fileInput.click.bind(fileInput));
const directoryButton = addContainer.querySelector("#directoryButton");
addContainer.addEventListener("mouseover", () => {
	directoryButton.classList.remove("mdc-fab--exited");
});
addContainer.addEventListener("mouseout", () => {
	directoryButton.classList.add("mdc-fab--exited");
});
const removeButton = document.body.querySelector("#removeButton");
removeButton.addEventListener("click", () => {
	confirmRemoveItems(items.querySelectorAll(".item.selected"));
});
const infoButton = document.body.querySelector("#infoButton");
infoButton.addEventListener("click", () => {
	const itemElements = items.querySelectorAll(".item.selected");
	if(itemElements.length === 1) {
		itemInfo(itemElements[0]);
	} else {
		itemsInfo(itemElements);
	}
});
const openButton = document.body.querySelector("#openButton");
openButton.addEventListener("click", () => {
	openItem(items.querySelector(".item.selected"));
});
const updateSelection = () => {
	const itemElements = items.querySelectorAll(".item.selected");
	if(itemElements.length === 0) {
		removeButton.classList.add("mdc-fab--exited");
		removeButton.blur();
		infoButton.classList.add("mdc-fab--exited");
		infoButton.blur();
		openButton.classList.add("mdc-fab--exited");
		openButton.blur();
	} else {
		let removeSafe = true;
		let infoSafe = true;
		for(const itemElement of itemElements) {
			if(itemElement.classList.contains("loading")) {
				infoSafe = false;
				if(!itemElement._xhr) {
					removeSafe = false;
					break;
				}
			}
		}
		if(removeSafe) {
			removeButton.classList.remove("mdc-fab--exited");
		} else {
			removeButton.classList.add("mdc-fab--exited");
			removeButton.blur();
		}
		if(infoSafe) {
			infoButton.classList.remove("mdc-fab--exited");
			if(itemElements.length === 1) {
				openButton.classList.remove("mdc-fab--exited");
			} else {
				openButton.classList.add("mdc-fab--exited");
				openButton.blur();
			}
		} else {
			infoButton.classList.add("mdc-fab--exited");
			infoButton.blur();
			openButton.classList.add("mdc-fab--exited");
			openButton.blur();
		}
	}
};
const addDirectory = async name => {
	if(!(name = await checkName(name))) {
		return;
	}
	const itemElement = html`
		<a class="tr item typeDir loading">
			<div class="td iconData">
				<i class="material-icons">folder</i>
			</div>
			<div class="td nameData" title="$${name}">$${name}</div>
			<div class="td sizeData">-</div>
			<div class="td typeData">-</div>
			<div class="td dateData">-</div>
		</a>
	`;
	const dateData = itemElement.querySelector(".dateData");
	items.insertBefore(itemElement, items.firstChild);
	Miro.request("POST", "/users/@me/pipe", {
		"X-Data": JSON.stringify({
			name: applyParent(name),
			type: "/"
		})
	}).then(Miro.response(xhr => {
		Miro.data.pipe.push((xhr.response.element = itemElement)._item = xhr.response);
		itemElement.href = `#${xhr.response.name}`;
		const date = new Date(xhr.response.date);
		dateData.textContent = getDate(date);
		dateData.title = date;
		itemElement.classList.remove("loading");
		render();
	}, () => {
		itemElement.parentNode.removeChild(itemElement);
		updateSelection();
	}));
};
directoryButton.addEventListener("click", () => {
	const dialog = new Miro.Dialog("Add Directory", html`
		<div class="mdc-text-field">
			<input id="name" name="name" class="mdc-text-field__input" type="text" value="Folder" maxlength="255" size="24" pattern="^[^/]+$" autocomplete="off" required>
			<label class="mdc-floating-label" for="name">Name</label>
			<div class="mdc-line-ripple"></div>
		</div>
	`, [{
		text: "Okay",
		type: "submit"
	}, "Cancel"]).then(value => {
		if(value === 0) {
			addDirectory(dialog.form.elements.name.value);
		}
	});
});
const openItem = itemElement => {
	itemElement._click = true;
	itemElement.click();
};
items.addEventListener("click", evt => {
	if(!evt.target.parentNode._click) {
		delete evt.target.parentNode._click;
		evt.preventDefault();
	}
}, true);
const sortIcon = html`<i id="sortIcon" class="material-icons">arrow_downward</i>`;
const heads = page.querySelector("#heads");
heads.addEventListener("click", evt => {
	if(evt.target.classList.contains("head")) {
		const sortKey = evt.target.getAttribute("data-sort");
		if(localStorage.pipe_sortItems === sortKey) {
			localStorage.pipe_reverseItems = +!+localStorage.pipe_reverseItems;
		} else {
			localStorage.pipe_sortItems = sortKey;
		}
		render();
	}
}, {
	capture: true,
	passive: true
});
let changeHash = false;
const hashChange = () => {
	if(changeHash) {
		changeHash = false;
		return;
	}
	if(items.querySelector(".item.loading")) {
		location.reload();
		changeHash = true;
		location.hash = `#${parent}`;
		return;
	}
	const target = decodeURI(location.hash.slice(1));
	if(target === "" || Miro.data.pipe.find(item => item.type === "/" && item.name === target)) {
		parent = target;
	} else {
		location.hash = "#";
		new Miro.Dialog("Error", "The target directory does not exist.");
		return;
	}
	render();
};
if(!location.hash) {
	location.hash = "#";
}
hashChange();
window.addEventListener("hashchange", hashChange);
