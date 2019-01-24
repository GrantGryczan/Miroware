this.title = "Corrupt";
this.description = "Apply actual corruption to your images.";
this.tags = ["file", "files", "online", "tool", "upload", "image", "images", "img", "imgs", "picture", "pictures", "pic", "pics", "photo", "photos", "corrupt", "corrupted", "corruptor", "corruption", "distort", "distorted", "distortion", "glitch", "glitched", "generate", "generator", "gif", "gifs", "jpeg", "jpegs", "jpg", "jpgs"];
this.showAds = true;
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
			<p>
				Miroware Corrupt is an image corruptor that works through actual corruption. It doesn't use fake corruption effects as other corruption tools might. This tool genuinely corrupts images.<br>
				If you upload a file here, your computer's files should be completely safe and unaffected. This tool creates newly corrupted images. It does not destroy images which are already saved.<br>
				This tool best works with compressed image formats such as JPEG and GIF.
			</p>
			<div id="panel" class="mdc-elevation--z3"></div>`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
