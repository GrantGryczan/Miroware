this.title = "Cube";
this.description = "CUBE!";
this.tags = ["cube"];
this.value = (await load("www/load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("www/load/body", this)).value;
this.value += html`
			<div id="wrapper"></div>`;
this.value += (await load("www/load/belt", this)).value;
this.value += html`
		<script src="https://threejs.org/build/three.min.js"></script>
		<script src="index.js"></script>`;
this.value += (await load("www/load/foot", this)).value;
this.done();
