this.title = "YouTube";
this.description = "Watch Miroware's videos!";
this.tags = ["redirect", "link", "youtube", "channel"];
this.value = (await load("www/load/head", this)).value;
this.value += (await load("www/load/body", this)).value;
this.value += html`
			Redirecting...`;
this.value += (await load("www/load/belt", this)).value;
this.value += html`
		<script>
			location.replace("${this.redir = "https://www.youtube.com/c/GrantGryczan"}");
		</script>`;
this.value += (await load("www/load/foot", this)).value;
this.done();
