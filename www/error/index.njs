this.title = "Error";
this.description = "An error occured.";
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += html`
			<div id="error"></div>`;
this.value += (await load("load/belt", this)).value;
this.value += (await load("load/foot", this)).value;
this.done();
