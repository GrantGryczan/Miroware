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
		(this.element = html`
			<div class="item loading">
				<div class="label">
					<div class="title" title="$${this.file.name}">$${this.file.name}</div>
					<div class="subtitle" title="0 / ${this.file.size}">0% (${getSize(0)} / ${getSize(this.file.size)})</div>
				</div>
				<button class="close mdc-icon-button material-icons">close</button>
			</div>
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
			this.xhr.upload.addEventListener("progress", evt => {
				const percentage = 100 * evt.loaded / evt.total;
				this.element.style.backgroundSize = `${percentage}%`;
				this.subtitleElement.title = `${evt.loaded} / ${evt.total}`;
				this.subtitleElement.textContent = `${Math.floor(10 * percentage) / 10}% (${getSize(evt.loaded)} / ${getSize(this.file.size)})`;
			});
		}, true).then(Miro.response(xhr => {
			this.element.classList.remove("loading");
		}, () => {
			this.element.classList.remove("loading");
			this.element.classList.add("error");
			this.subtitleElement.textContent = "An error occurred. Click to retry.";
			this.element.addEventListener("click", this.retry.bind(this));
		}));
	}
	close() {
		this.xhr.abort();
		this.element.parentNode.removeChild(this.element);
	}
	retry(evt) {
		if(!this.closeElement.contains(evt.target)) {
			this.element.parentNode.replaceChild(this.element, new PipeLoadingItem(this.file).element);
		}
	}
}
const addFile = file => {
	// TODO: check names
	loadingItems.appendChild(new PipeLoadingItem(file).element);
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
