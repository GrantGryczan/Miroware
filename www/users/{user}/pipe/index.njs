if(notLoggedIn(this)) {
	return;
}
this.title = "Pipe";
this.image = "/pipe/images/icon/full.png";
this.icon = "/pipe/images/icon/cover.png";
this.data = this.user._id;
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += html`
			<div id="panels">
				<div class="panel side left">
					<button id="addButton" class="mdc-fab" title="Add files">
						<i class="mdc-fab__icon material-icons">add</i>
					</button>
					<button id="directoryButton" class="mdc-fab mdc-fab--mini mdc-fab--exited" title="Add directory">
						<i class="mdc-fab__icon material-icons">folder</i>
					</button>
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
					</button>
				</div>
				<div class="panel center">
					<span id="path"></span>
					<div id="table">
						<div id="heads">
							<div id="viewHead" class="head">
								<button class="mdc-icon-button material-icons" title="View mode">view_module</button>
							</div>
							<div id="nameHead" class="head sort" data-sort="name">
								<span class="label spaced">Name</span><button class="mdc-icon-button material-icons spaced" title="Sort">sort</button>
							</div>
							<div id="sizeHead" class="head sort" data-sort="size">
								<span class="label spaced">Size</span><button class="mdc-icon-button material-icons spaced" title="Sort">sort</button>
							</div>
							<div id="typeHead" class="head sort" data-sort="type">
								<span class="label spaced">Type</span><button class="mdc-icon-button material-icons spaced" title="Sort">sort</button>
							</div>
							<div id="dateHead" class="head sort" data-sort="date">
								<span class="label spaced">Date</span><button class="mdc-icon-button material-icons spaced" title="Sort">sort</button>
							</div>
						</div>
						<div id="items"></div>
					</div>
				</div>
				<div class="panel side right"></div>
			</div>`;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<div id="targetIndicator"></div>
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
