this.title = "Pipe";
this.image = "/pipe/images/icon/full.png";
this.icon = "/pipe/images/icon/cover.png";
let {user} = this;
const isMe = user && this.params.user === String(user._id);
if(!isMe) {
	let userID;
	try {
		userID = ObjectID(this.params.user);
	} catch(err) {}
	if(userID) {
		user = await users.findOne({
			_id: userID
		});
	} else {
		user = null;
	}
}
if(user) {
	this.data = {
		user: {
			id: user._id,
			name: user.name
		},
		isMe
	}
} else {
	Object.assign(this, await load("error/404", this));
	this.done();
	return;
}
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += html`
			<div id="panels">
				<div class="panel side left">
					<div class="pane">
						<div id="creation">
							<button id="addFiles" class="mdc-button mdc-button--raised spaced mdc-ripple" title="Upload file(s)">
								<i class="mdc-button__icon material-icons">file_upload</i>Upload
							</button>
							<button id="addDirectory" class="mdc-icon-button mdc-button--raised material-icons spaced mdc-ripple" title="Create directory">create_new_folder</button>
						</div>
						<div id="queuedItems" class="items"></div>
					</div>
				</div>
				<div class="panel center">
					<span id="ancestors"></span>
					<div class="pane">
						<div id="header">
							<div class="cell view">
								<button id="viewMode" class="mdc-icon-button material-icons" title="Tile view">view_module</button>
							</div>
							<div class="cell sort name">
								<span class="label spaced">Name</span><button class="mdc-icon-button material-icons spaced" data-sort="name" title="Sort by name">sort</button>
							</div>
							<div class="cell sort size">
								<span class="label spaced">Size</span><button class="mdc-icon-button material-icons spaced" data-sort="size" title="Sort by size">sort</button>
							</div>
							<div class="cell sort type">
								<span class="label spaced">Type</span><button class="mdc-icon-button material-icons spaced" data-sort="type" title="Sort by type">sort</button>
							</div>
							<div class="cell sort date">
								<span class="label spaced">Date</span><button class="mdc-icon-button material-icons spaced" data-sort="date" title="Sort by date">sort</button>
							</div>
						</div>
						<div id="items" class="items"></div>
					</div>
				</div>
				<form id="properties" class="panel side right">
					<div class="property hidden" data-key="name">
						<div class="mdc-text-field">
							<input id="name" name="name" class="mdc-text-field__input" type="text" maxlength="255" pattern="^[^/]+$" autocomplete="off" spellcheck="false" required>
							<label class="mdc-floating-label mdc-floating-label--float-above" for="name">Name</label>
							<div class="mdc-line-ripple"></div>
						</div><br>
					</div>
					<div class="property hidden" data-key="type">
						<div class="mdc-text-field">
							<input id="type" name="type" class="mdc-text-field__input" type="text" maxlength="255" pattern="^[^\\x00-\\x20()<>@,;:\\\\&quot;/[\\]?.=]+/[^\\x00-\\x20()<>@,;:\\\\&quot;/[\\]?=]+$" spellcheck="false" required>
							<label class="mdc-floating-label mdc-floating-label--float-above" for="type">Type</label>
							<div class="mdc-line-ripple"></div>
						</div><br>
					</div>
					<div class="property hidden" data-key="url">
						<div class="mdc-text-field spaced">
							<input id="url" name="url" class="mdc-text-field__input" type="url" readonly>
							<label class="mdc-floating-label mdc-floating-label--float-above" for="url">URL</label>
							<div class="mdc-line-ripple"></div>
						</div><button id="copyURL" class="mdc-icon-button material-icons spaced" type="button" title="Copy URL to clipboard">link</button><br>
						<a id="linkPreview" target="_blank">Preview link</a><br>
					</div>
					<div class="property hidden" data-key="actions">
						<button id="save" class="mdc-icon-button mdc-button--raised material-icons spaced mdc-ripple" type="submit" title="Save" disabled>save</button><button id="download" class="mdc-icon-button material-icons spaced mdc-ripple" title="Download">file_download</button><button id="delete" class="mdc-icon-button material-icons spaced mdc-ripple" title="Delete">delete</button>
					</div>
					<div>
						Selected items: <b id="selectionLength"></b> (<b id="selectionSize"></b>)
					</div>
				</form>
			</div>`;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<div id="targetIndicator"></div>
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
