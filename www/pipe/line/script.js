"use strict";
const container = document.body.querySelector("#container");
const page = container.querySelector("main");
const items = page.querySelector("#items");
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
const createItemElement = item => {
	const itemElement = html`
		<table>
			<tbody>
				<tr class="item ready">
					<td class="nameData" title="$${item.name}">$${item.name}</td>
					<td class="sizeData" title="${item.size} B">${getSize(item.size)}</td>
					<td class="dateData">${getDate(item.date)}</td>
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
let loading = 0;
const subtractLoading = () => {
	loading--;
};
const addFile = file => {
	loading++;
	const fileSize = getSize(file.size);
	const itemElement = html`
		<table>
			<tbody>
				<tr class="item loading">
					<td class="nameData" title="$${file.name}">$${file.name}</td>
					<td class="sizeData" title="- / ${file.size} B">- / ${fileSize}</td>
					<td class="dateData">-</td>
				</tr>
			</tbody>
		</table>
	`.querySelector("tr");
	const typeData = itemElement.querySelector(".typeData");
	const sizeData = itemElement.querySelector(".sizeData");
	const dateData = itemElement.querySelector(".dateData");
	items.insertBefore(itemElement, items.firstChild);
	let xhr;
	Miro.request("POST", "/users/@me/pipe", {
		"Content-Type": "application/octet-stream",
		"X-Data": JSON.stringify({
			name: file.name
		})
	}, file, xhrArg => {
		xhr = xhrArg;
		xhr.upload.addEventListener("progress", evt => {
			itemElement.style.backgroundSize = `${100 * evt.loaded / evt.total}%`;
			sizeData.textContent = `${getSize(evt.loaded)} / ${fileSize}`;
			sizeData.title = `${evt.loaded} B / ${evt.total} B`;
		});
	}).then(Miro.response(() => {
		itemElement._item = xhr.response;
		sizeData.textContent = fileSize;
		sizeData.title = `${file.size} B`;
		dateData.textContent = getDate(xhr.response.date);
		itemElement.classList.remove("loading");
		itemElement.classList.add("ready");
	}, () => {
		itemElement.parentNode.removeChild(itemElement);
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
window.onbeforeunload = () => loading || undefined;
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
};
let mouseTarget;
let mouseDown = -1;
let mouseMoved = false;
document.addEventListener("mousedown", evt => {
	mouseMoved = false;
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
	if(evt.target.parentNode.classList.contains("item") && !mouseMoved) {
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
		}
	}
}, {
	capture: true,
	passive: true
});
