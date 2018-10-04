this.title = "Pipe";
this.description = "Upload stuff for free.";
this.tags = ["pipe", "file", "files", "host", "hosting", "hoster", "upload", "uploader", "image", "images", "direct", "link", "links", "url", "urls", "free"];
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += html`
			<div id="banner"></div>`;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				test`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
