this.cache = true;
this.title = "Discord Colorbot";
this.description = "Invite Colorbot to one of your own Discord servers!";
this.tags = ["redirect", "link", "discord", "bot", "authorize", "authorization", "authorizing", "colorbot", "color", "colors", "role", "roles", "custom"];
this.value = (await load("load/head", this)).value;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				Redirecting...`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script>
			location.replace("${this.redir = "https://discordapp.com/oauth2/authorize?client_id=418957259687723028&scope=bot&permissions=268454912"}");
		</script>`;
this.value += (await load("load/foot", this)).value;
this.done();
