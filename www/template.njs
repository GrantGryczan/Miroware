this.title = "Template";
this.description = "Hello, world!";
this.tags = ["template", "test"];
this.value = (await load("/load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("/load/body", this)).value;
this.value += html`
			Hello, world!`;
this.value += (await load("/load/belt", this)).value;
this.value += html`
		<script src="index.js"></script>`;
this.value += (await load("/load/foot", this)).value;
this.exit();
