this.title = "Cube";
this.description = "CUBE!";
this.tags = ["cube"];
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += html`
			<div id="wrapper"></div>`;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script src="https://threejs.org/build/three.min.js"></script>
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
