this.title = "Pipe Link Updater";
this.description = "Update your Pipe URLs to use the new domain.";
this.tags = ["pipe", "file", "files", "host", "hosting", "hoster", "upload", "uploader", "image", "images", "direct", "link", "links", "url", "urls", "free"];
this.image = "/pipe/images/icon/full.png";
this.icon = "/pipe/images/icon/cover.png";
this.showAds = true;
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				<p>Paste any text, and Pipe URLs inside it will be updated to the new domain and user ID format.</p>
				<div class="mdc-text-field mdc-text-field--textarea mdc-text-field--fullwidth">
					<textarea id="input" class="mdc-text-field__input" rows="8"></textarea>
					<label class="mdc-floating-label" for="input">Input</label>
				</div><br>
				<div class="mdc-text-field mdc-text-field--textarea mdc-text-field--fullwidth">
					<textarea id="output" class="mdc-text-field__input" rows="8" readonly></textarea>
					<label class="mdc-floating-label alwaysFloat" for="output">Output</label>
				</div>`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
