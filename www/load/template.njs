this.title = "Template";
this.description = "Hello, world!";
this.tags = ["template", "test"];
this.value = (await load("/load/head.njs", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("/load/body.njs", this)).value;
this.value += html`
			Hi.`;
this.value += (await load("/load/belt.njs", this)).value;
this.value += html`
		<script src="index.js"></script>`;
this.value += (await load("/load/foot.njs", this)).value;
this.exit();
// test
