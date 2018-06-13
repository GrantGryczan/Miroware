this.cache = true;
this.title = "Terms of Service";
this.description = "I feel like the title is already pretty self-explanatory.";
this.tags = ["terms", "of", "service", "tos"];
this.value = (await load("www/load/head", this)).value;
this.value += (await load("www/load/body", this)).value;
this.value += (await load("www/load/pagehead", this)).value;
this.value += html`
				Not yet...`;
this.value += (await load("www/load/pagefoot", this)).value;
this.value += (await load("www/load/belt", this)).value;
this.value += (await load("www/load/foot", this)).value;
this.done();
