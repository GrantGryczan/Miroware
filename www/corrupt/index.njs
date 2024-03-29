this.title = "Image Corruptor";
this.description = "Apply corruption to your images.";
this.tags = ["file", "files", "online", "tool", "upload", "image", "images", "img", "imgs", "picture", "pictures", "pic", "pics", "photo", "photos", "corrupt", "corrupted", "corruptor", "corruption", "distort", "distorted", "distortion", "glitch", "glitched", "generate", "generator", "gif", "gifs", "jpeg", "jpegs", "jpg", "jpgs"];
this.showAds = true;
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
			<p>
				This corrupts images through actual corruption. It doesn't use fake corruption effects as other image corruptors might.<br>
				This tool best works with compressed image formats such as JPEG and GIF.<br>
				Corruption is randomized, so you can press the corrupt button multiple times and get different results.<br>
				The corruption factor is how many bytes to corrupt from the original. (A higher factor does not always mean it will look cooler!)
			</p>
			<div id="panel" class="mdc-elevation--z3">
				<form id="head">
					<button id="upload" class="mdc-button mdc-ripple" title="Upload image">
						<i class="mdc-button__icon material-icons">file_upload</i>Upload
					</button>
					<div id="corruption">
						<div class="mdc-text-field mdc-text-field--dense spaced">
							<input id="factor" class="mdc-text-field__input" type="number" min="0" max="10000" value="8" title="Corruption factor" required>
							<label class="mdc-floating-label" for="factor">Factor</label>
							<div class="mdc-line-ripple"></div>
						</div><button id="corrupt" class="mdc-button spaced mdc-ripple" type="submit" title="Corrupt image" disabled>Corrupt</button>
					</div>
					<button id="download" class="mdc-button mdc-ripple" title="Download image" disabled>
						<i class="mdc-button__icon material-icons">file_download</i>Download
					</button>
				</form>
				<div id="content">
					<div id="input">
						<img class="media">
					</div>
					<div id="output">
						<img class="media hidden">
					</div>
				</div>
			</div>`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
