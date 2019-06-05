this.cache = true;
this.title = "Sponsus";
this.description = "Support Miroware's content!";
this.tags = ["redirect", "link", "sponsus", "support", "donate", "donation", "donations", "contribute", "contribution", "contributions", "money", "support", "sponsor", "pledge", "patron", "patreon"];
this.value = (await load("load/head", this)).value;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				Redirecting...`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script>
			location.replace("${this.redir = "https://sponsus.org/u/miroware"}");
		</script>`;
this.value += (await load("load/foot", this)).value;
this.done();
