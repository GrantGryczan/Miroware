this.cache = true;
this.title = "Privacy Policy";
this.description = "I feel like the title is already pretty self-explanatory.";
this.tags = ["privacy", "policy", "pp"];
this.value = (await load("load/head", this)).value;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				Not yet...`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += (await load("load/foot", this)).value;
this.done();
