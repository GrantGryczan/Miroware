this.cache = true;
this.title = "Patreon";
this.description = "Support File Garden's development!";
this.tags = ["redirect", "link", "patreon", "support", "donate", "donation", "donations", "contribute", "contribution", "contributions", "money"];
this.value = (await load("load/head", this)).value;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				Redirecting...`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script>
			location.replace("${this.redir = "https://www.patreon.com/filegarden"}");
		</script>`;
this.value += (await load("load/foot", this)).value;
this.done();
