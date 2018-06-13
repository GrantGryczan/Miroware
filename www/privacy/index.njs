this.cache = true;
this.title = "Privacy Policy";
this.description = "I feel like the title is already pretty self-explanatory.";
this.tags = ["privacy", "policy", "pp"];
this.value = (await load("www/load/head", this)).value;
this.value += (await load("www/load/body", this)).value;
this.value += (await load("www/load/pagehead", this)).value;
this.value += html`
				Not yet...`;
this.value += (await load("www/load/pagefoot", this)).value;
this.value += (await load("www/load/belt", this)).value;
this.value += (await load("www/load/foot", this)).value;
this.done();
