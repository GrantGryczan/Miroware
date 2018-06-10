this.title = "Template";
this.description = "Hello, world!";
this.tags = ["template", "test"];
this.value = (await load("www/load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("www/load/body", this)).value;
this.value += (await load("www/load/pagehead", this)).value;
this.value += html`
				Hello, world!`;
this.value += (await load("www/load/pagefoot", this)).value;
this.value += (await load("www/load/belt", this)).value;
this.value += html`
		<script src="index.js"></script>`;
this.value += (await load("www/load/foot", this)).value;
this.done();
