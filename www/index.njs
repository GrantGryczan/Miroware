this.title = "File Garden";
this.description = "Host your files with decency.";
this.tags = ["filegarden", "garden", "file", "files", "host", "hosting", "hoster", "upload", "uploader", "image", "images", "direct", "link", "links", "url", "urls", "free"];
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				<p>File Garden lets you upload any type of file to link elsewhere, forever for free.</p>
				<div>
					<a class="mdc-button mdc-button--raised mdc-ripple" href="${this.user ? `/users/${this.user._id}/garden/#` : "/login/?dest=%2F"}">Go to Your Garden</a>
				</div>
				<div id="cube"></div>`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += (await load("load/foot", this)).value;
this.done();
