this.cache = true;
this.title = "About";
this.description = "Learn about Miroware.";
this.tags = ["about", "info", "information"];
this.value = (await load("load/head", this)).value;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				[Insert information here.]`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += (await load("load/foot", this)).value;
this.done();
