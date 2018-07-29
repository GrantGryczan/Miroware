this.cache = true;
this.title = "Terms of Service";
this.description = "I feel like the title is already pretty self-explanatory.";
this.tags = ["terms", "of", "service", "tos"];
this.value = (await load("load/head", this)).value;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				Not yet...`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += (await load("load/foot", this)).value;
this.done();
