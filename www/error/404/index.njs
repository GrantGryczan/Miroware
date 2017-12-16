this.title = "Error: 404";
this.description = "Not Found";
this.tags = ["error", "status", "404", "not", "found"];
this.value = (await load("/load/head.njs", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("/load/body.njs", this)).value;
this.value += html`
			<div id="error"></div>`;
this.value += (await load("/load/belt.njs", this)).value;
this.value += (await load("/load/foot.njs", this)).value;
this.exit();
