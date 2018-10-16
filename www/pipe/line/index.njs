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
				<h2 id="path"></h2>
				<table id="table">
					<thead id="heads">
						<th id="iconHead"></th>
						<th id="nameHead" class="head" data-sort="name">Name</th>
						<th id="sizeHead" class="head" data-sort="size">Size</th>
						<th id="typeHead" class="head" data-sort="type">Type</th>
						<th id="dateHead" class="head" data-sort="date">Date</th>
					</thead>
					<tbody id="items"></tbody>
				</table>`;
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
			</button>`;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<div id="targetIndicator"></div>
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
