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
					<span class="title" title="$${file.name}">$${file.name}</span>
					<span class="subtitle" title="0 / ${file.size}">0% (${getSize(0)} / ${getSize(file.size)})</span>
				</div>
				<div class="cancel material-icons">cancel</div>
			</div>
		`)._item = this;
		const sizeLabel = this.element.querySelector(".label > .subtitle");
		Miro.request("POST", "/users/@me/pipe", {
			"Content-Type": "application/octet-stream",
			"X-Data": JSON.stringify({
				name: name // TODO: apply parent
			})
		}, file, xhr => {
			this.xhr = xhr;
			this.xhr.upload.addEventListener("progress", evt => {
				const percentage = 100 * evt.loaded / evt.total;
				this.element.style.backgroundSize = `${percentage}%`;
				sizeLabel.title = `${evt.loaded} / ${evt.total}`;
				sizeLabel.textContent = `${Math.round(10 * percentage) / 10}% (${getSize(evt.loaded)} / ${fileSize})`;
			});
		}).then(Miro.response(xhr => {
			
		}, () => {
			
		})).finally(this.element.parentNode.removeChild.bind(this.element.parentNode, this.element));
	}
}
const addFile = async file => {
	// TODO: check names
	const item = new PipeLoadingItem(file);
	loadingItems.insertBefore(item.element, loadingItems.firstChild);
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
