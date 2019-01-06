this.title = "Wow!";
this.description = "Magical!";
this.tags = ["wow", "magical", "magic"];
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += html`
		<div id="wow">Wow!</div>
		<span id="magical">Magical!</span>`;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
