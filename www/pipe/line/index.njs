if(notLoggedIn(this)) {
	return;
}
this.title = "Pipe Beta";
this.image = "/pipe/images/icon/full.png";
this.icon = "/pipe/images/icon/cover.png";
this.data = {
	user: this.user._id,
	pipe: (await load("api/users/@me/pipe", {
		...this,
		method: "GET"
	})).value
};
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				<span id="path"></span>
				<div id="table" class="table">
					<div id="heads" class="thead">
						<div id="iconHead" class="th"></div>
						<div id="nameHead" class="th head" data-sort="name">Name</div>
						<div id="sizeHead" class="th head" data-sort="size">Size</div>
						<div id="typeHead" class="th head" data-sort="type">Type</div>
						<div id="dateHead" class="th head" data-sort="date">Date</div>
					</div>
					<div id="items" class="tbody"></div>
				</div>`;
this.value += (await load("load/pagefoot", this)).value;
this.value += html`
			<div id="addContainer">
				<button id="addButton" class="mdc-fab" title="Add files">
					<i class="mdc-fab__icon material-icons">add</i>
				</button>
				<button id="directoryButton" class="mdc-fab mdc-fab--mini mdc-fab--exited" title="Add directory">
					<i class="mdc-fab__icon material-icons">folder</i>
				</button>
			</div>
			<button id="removeButton" class="mdc-fab mdc-fab--mini mdc-fab--exited" title="Remove">
				<i class="mdc-fab__icon material-icons">delete</i>
			</button>
			<button id="infoButton" class="mdc-fab mdc-fab--mini mdc-fab--exited" title="Info">
				<i class="mdc-fab__icon material-icons">info</i>
			</button>
			<button id="openButton" class="mdc-fab mdc-fab--mini mdc-fab--exited" title="Open">
				<i class="mdc-fab__icon material-icons">keyboard_return</i>
			</button>
			<button id="linkButton" class="mdc-fab mdc-fab--mini mdc-fab--exited" title="Copy URL to clipboard">
				<i class="mdc-fab__icon material-icons">link</i>
			</button>`;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<div id="targetIndicator"></div>
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
