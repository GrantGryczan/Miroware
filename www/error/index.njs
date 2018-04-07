this.title = "Error";
this.description = "An error occured.";
this.value = (await load("www/load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("www/load/body", this)).value;
this.value += html`
			<div id="error"></div>`;
this.value += (await load("www/load/belt", this)).value;
this.value += (await load("www/load/foot", this)).value;
this.done();
