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
					<div class="pane">
						<div id="add">
							<button id="addFiles" class="mdc-button mdc-button--raised spaced mdc-ripple" title="Add file(s)">
								<i class="mdc-button__icon material-icons">file_upload</i>Upload
							</button>
							<button id="addDirectory" class="mdc-icon-button mdc-button--raised material-icons spaced mdc-ripple" title="Add folder">folder</button>
						</div>
						<div id="itemsLoading"></div>
					</div>
				</div>
				<div class="panel center">
					<span id="path"></span>
					<div class="pane">
						<div id="sort">
							<div class="cell view">
								<button id="viewMode" class="mdc-icon-button material-icons" title="Tile view">view_module</button>
							</div>
							<div class="cell sort name">
								<span class="label spaced">Name</span><button id="sortName" class="mdc-icon-button material-icons spaced" data-sort="name" title="Sort by name">sort</button>
							</div>
							<div class="cell sort size">
								<span class="label spaced">Size</span><button id="sortSize" class="mdc-icon-button material-icons spaced" data-sort="size" title="Sort by size">sort</button>
							</div>
							<div class="cell sort type">
								<span class="label spaced">Type</span><button id="sortType" class="mdc-icon-button material-icons spaced" data-sort="type" title="Sort by type">sort</button>
							</div>
							<div class="cell sort date">
								<span class="label spaced">Date</span><button id="sortDate" class="mdc-icon-button material-icons spaced" data-sort="date" title="Sort by date">sort</button>
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
