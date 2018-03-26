this.title = "Discord";
this.description = "Join Miroware's community!";
this.tags = ["redirect", "link", "discord", "invite", "invitation", "join"];
this.value = (await load("www/load/head", this)).value;
this.value += (await load("www/load/body", this)).value;
this.value += html`
			Redirecting...`;
this.value += (await load("www/load/belt", this)).value;
this.value += html`
		<script>
			location.replace("${this.redir = "https://discordapp.com/oauth2/authorize?client_id=343262365195698177&scope=identify&response_type=code"}");
		</script>`;
this.value += (await load("www/load/foot", this)).value;
this.done();
