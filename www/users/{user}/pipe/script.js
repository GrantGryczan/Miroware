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
const loadingItems = document.body.querySelector("#loadingItems");
class PipeLoadingItem {
	constructor(file) {
		this.file = file;
		loadingItems.appendChild(((this.element = html`
			<div class="item loading">
				<div class="label">
					<div class="title" title="$${this.file.name}">$${this.file.name}</div>
					<div class="subtitle" title="0 / ${this.file.size}">0% (${getSize(0)} / ${getSize(this.file.size)})</div>
				</div>
				<button class="close mdc-icon-button material-icons">close</button>
			</div>
		`)._item = this).element);
		this.querySelector(".close").addEventListener(this.close.bind(this));
		const subtitle = this.element.querySelector(".subtitle");
		Miro.request("POST", "/users/@me/pipe", {
			"Content-Type": "application/octet-stream",
			"X-Data": JSON.stringify({
				name: name // TODO: apply parent
			})
		}, this.file, xhr => {
			this.xhr = xhr;
			this.xhr.upload.addEventListener("progress", evt => {
				const percentage = 100 * evt.loaded / evt.total;
				this.element.style.backgroundSize = `${percentage}%`;
				subtitle.title = `${evt.loaded} / ${evt.total}`;
				subtitle.textContent = `${Math.floor(10 * percentage) / 10}% (${getSize(evt.loaded)} / ${getSize(this.file.size)})`;
			});
		}, true).then(Miro.response(xhr => {
			this.element.classList.remove("loading");
		}, () => {
			this.element.classList.remove("loading");
			this.element.classList.add("error");
			subtitle.textContent = "An error occurred. Click to retry.";
			this.element.addEventListener(this.close.bind(this));
		}));
	}
	close() {
		if(!this.closed) {
			this.xhr.abort();
			this.element.parentNode.removeChild(this.element);
			this.closed = true;
		}
	}
	retry() {
		if(!this.closed) {
			this.close();
			new PipeLoadingItem(this.file);
		}
	}
}
const addFile = file => {
	// TODO: check names
	new PipeLoadingItem(file);
};
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.multiple = true;
fileInput.addEventListener("change", () => {
	Array.prototype.forEach.call(fileInput.files, addFile);
	fileInput.value = null;
});
const addFiles = document.body.querySelector("#addFiles");
addFiles.addEventListener("click", fileInput.click.bind(fileInput));
