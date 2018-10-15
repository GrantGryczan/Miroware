"use strict";
const container = document.body.querySelector("#container");
const page = container.querySelector("main");
const items = page.querySelector("#items");
const getSize = size => {
	if(size < 1000) {
		return `${size} B`;
	}
	size /= 1000;
	if(size < 1000) {
		return `${Math.round(100 * size) / 100} kB`;
	}
	size /= 1000;
	if(size < 1000) {
		return `${Math.round(100 * size) / 100} MB`;
	}
	size /= 1000;
	if(size < 1000) {
		return `${Math.round(100 * size) / 100} GB`;
	}
	size /= 1000;
	if(size < 1000) {
		return `${Math.round(100 * size) / 100} TB`;
	}
	size /= 1000;
	if(size < 1000) {
		return `${Math.round(100 * size) / 100} PB`;
	}
	size /= 1000;
	if(size < 1000) {
		return `${Math.round(100 * size) / 100} EB`;
	}
	size /= 1000;
	if(size < 1000) {
		return `${Math.round(100 * size) / 100} ZB`;
	}
	size /= 1000;
	return `${Math.round(100 * size) / 100} YB`;
};
const getDate = date => new Date(date).toString().split(" ").slice(1, 5).join(" ");
const createItemElement = item => {
	const date = new Date(item.date);
	const itemElement = html`
		<table>
			<tbody>
				<tr class="item">
					<td class="nameData" title="$${item.name}">$${item.name}</td>
					<td class="sizeData" title="${item.size} B">${getSize(item.size)}</td>
					<td class="typeData" title="$${item.type}">$${item.type}</td>
					<td class="dateData" title="$${date}">$${getDate(date)}</td>
				</tr>
			</tbody>
		</table>
	`.querySelector("tr");
	itemElement._item = item;
	return itemElement;
};
for(const item of Miro.data) {
	items.insertBefore(createItemElement(item), items.firstChild);
}
const addFile = file => {
	const fileSize = getSize(file.size);
	const itemElement = html`
		<table>
			<tbody>
				<tr class="item loading">
					<td class="nameData" title="$${file.name}">$${file.name}</td>
					<td class="sizeData" title="- / ${file.size} B">- / ${fileSize}</td>
					<td class="typeData">-</td>
					<td class="dateData">-</td>
				</tr>
			</tbody>
		</table>
	`.querySelector("tr");
	itemElement._item = file;
	const sizeData = itemElement.querySelector(".sizeData");
	const typeData = itemElement.querySelector(".typeData");
	const dateData = itemElement.querySelector(".dateData");
	items.insertBefore(itemElement, items.firstChild);
	Miro.request("POST", "/users/@me/pipe", {
		"Content-Type": "application/octet-stream",
		"X-Data": JSON.stringify({
			name: file.name
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
		Miro.data.push(itemElement._item = xhr.response);
		sizeData.textContent = fileSize;
		sizeData.title = `${file.size} B`;
		typeData.textContent = typeData.title = xhr.response.type;
		const date = new Date(xhr.response.date);
		dateData.textContent = getDate(date);
		dateData.title = date;
		itemElement.classList.remove("loading");
	}, () => {
		itemElement.parentNode.removeChild(itemElement);
	})).finally(updateSelection);
};
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
	if(mouseDown !== -1 && mouseTarget && mouseTarget.parentNode.classList.contains("item") && !mouseMoved) {
		selectItem(evt.target.parentNode, evt, 2);
	}
	mouseMoved = true;
}, {
	capture: true,
	passive: true
});
document.addEventListener("mouseup", evt => {
	if(!mouseMoved && mouseDown !== -1 && page.contains(evt.target)) {
		if(evt.target.parentNode.classList.contains("item")) {
			selectItem(evt.target.parentNode, evt, evt.button);
		} else {
			for(const item of items.querySelectorAll(".item.selected")) {
				item.classList.remove("selected");
			}
			selectedItem = focusedItem = null;
			updateSelection();
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
			if(!infoButton.classList.contains("mdc-fab--exited")) {
				infoButton.click();
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
		if(!infoButton.classList.contains("mdc-fab--exited")) {
			infoButton.click();
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
		Miro.data.splice(Miro.data.indexOf(itemElement._item), 1);
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
		Are you sure you want to remove <b>$${itemElement._item.name}</b>?<br>
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
const openItem = itemElement => {
	const body = html`
		<div class="mdc-text-field">
			<input id="name" class="mdc-text-field__input" type="text" value="$${itemElement._item.name}" maxlength="255" size="24" pattern="^[^/]+$" autocomplete="off" spellcheck="false" required>
			<label class="mdc-floating-label alwaysFloat" for="name">Name</label>
			<div class="mdc-line-ripple"></div>
		</div><br>
		<div class="mdc-text-field">
			<input id="type" class="mdc-text-field__input" type="text" value="$${itemElement._item.type}" maxlength="255" size="24" pattern="^[^\\x00-\\x20()<>@,;:\\\\&quot;/[\\]?.=]+/[^\\x00-\\x20()<>@,;:\\\\&quot;/[\\]?.=]+$" spellcheck="false" required>
			<label class="mdc-floating-label alwaysFloat" for="type">Type</label>
			<div class="mdc-line-ripple"></div>
		</div><br>
		<div class="mdc-text-field spaced">
			<input id="url" class="mdc-text-field__input" type="url" value="$${itemElement._item.url}" size="24" readonly>
			<label class="mdc-floating-label alwaysFloat" for="url">URL</label>
			<div class="mdc-line-ripple"></div>
		</div><button class="mdc-icon-button material-icons spaced" type="button" title="Copy URL to clipboard">link</button>
	`;
	const name = body.querySelector("#name");
	const type = body.querySelector("#type");
	const url = body.querySelector("#url");
	body.querySelector("button").addEventListener("click", () => {
		url.select();
		document.execCommand("copy");
		Miro.snackbar("URL copied to clipboard");
	});
	new Miro.Dialog("Item", body, [{
		text: "Okay",
		type: "submit"
	}, "Cancel"]).then(value => {
		if(value === 0) {
			const changedName = itemElement._item.name !== name.value;
			const changedType = itemElement._item.type !== type.value;
			if(changedName || changedType) {
				itemElement.classList.add("loading");
				updateSelection();
				const data = {};
				if(changedName) {
					data.name = name.value;
				}
				if(changedType) {
					data.type = type.value;
				}
				Miro.request("PUT", `/users/@me/pipe/${itemElement._item.id}`, {}, data).then(Miro.response(xhr => {
					Miro.data.splice(Miro.data.indexOf(itemElement._item), 1);
					Miro.data.push(itemElement._item = xhr.response);
					const nameData = itemElement.querySelector(".nameData");
					nameData.textContent = nameData.title = xhr.response.name;
					const typeData = itemElement.querySelector(".typeData");
					typeData.textContent = typeData.title = xhr.response.type;
				})).finally(() => {
					itemElement.classList.remove("loading");
					updateSelection();
				});
			}
		}
	});
	setTimeout(url.select.bind(url));
};
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.multiple = true;
fileInput.addEventListener("change", () => {
	Array.prototype.forEach.call(fileInput.files, addFile);
	fileInput.value = null;
});
const addButton = container.querySelector("#addButton");
addButton.addEventListener("click", fileInput.click.bind(fileInput));
const directoryButton = container.querySelector("#directoryButton");
const removeButton = container.querySelector("#removeButton");
removeButton.addEventListener("click", () => {
	confirmRemoveItems(items.querySelectorAll(".item.selected"));
});
const infoButton = container.querySelector("#infoButton");
infoButton.addEventListener("click", () => {
	openItem(items.querySelector(".item.selected"));
});
const updateSelection = () => {
	const itemElements = items.querySelectorAll(".item.selected");
	if(itemElements.length === 0) {
		removeButton.classList.add("mdc-fab--exited");
		removeButton.blur();
		infoButton.classList.add("mdc-fab--exited");
		infoButton.blur();
	} else {
		let safeToRemove = true;
		for(const itemElement of itemElements) {
			if(itemElement.classList.contains("loading") && !itemElement._xhr) {
				safeToRemove = false;
				break;
			}
		}
		if(safeToRemove) {
			removeButton.classList.remove("mdc-fab--exited");
		} else {
			removeButton.classList.add("mdc-fab--exited");
			removeButton.blur();
		}
		if(itemElements.length === 1 && !itemElements[0].classList.contains("loading")) {
			infoButton.classList.remove("mdc-fab--exited");
		} else {
			infoButton.classList.add("mdc-fab--exited");
			infoButton.blur();
		}
	}
};
