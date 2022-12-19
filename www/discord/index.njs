this.cache = true;
this.title = "Discord";
this.description = "Join File Garden's Discord community!";
this.tags = ["redirect", "link", "discord", "invite", "invitation", "join"];
this.value = (await load("load/head", this)).value;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				Redirecting...`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script>
			location.replace("${this.redir = "https://discordapp.com/invite/fWexzeh"}");
		</script>`;
this.value += (await load("load/foot", this)).value;
this.done();
