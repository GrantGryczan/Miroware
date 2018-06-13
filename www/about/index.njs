this.cache = true;
this.title = "About";
this.description = "Learn about Miroware.";
this.tags = ["about", "info", "information"];
this.value = (await load("www/load/head", this)).value;
this.value += (await load("www/load/body", this)).value;
this.value += (await load("www/load/pagehead", this)).value;
this.value += html`
				[Insert information here.]`;
this.value += (await load("www/load/pagefoot", this)).value;
this.value += (await load("www/load/belt", this)).value;
this.value += (await load("www/load/foot", this)).value;
this.done();
