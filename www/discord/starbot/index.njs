this.title = "Discord Starbot";
this.description = "Invite Starbot to one of your own Discord servers!";
this.tags = ["redirect", "link", "discord", "bot", "authorize", "authorization", "authorizing", "starbot", "star", "stars", "starboard", "board"];
this.value = (await load("/load/head.njs", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("/load/body.njs", this)).value;
this.value += html`
			Redirecting...`;
this.value += (await load("/load/belt.njs", this)).value;
this.value += html`
		<script>
			location.replace("${this.redirect = "https://discordapp.com/oauth2/authorize?client_id=369313537073348608&scope=bot&permissions=379968"}");
		</script>`;
this.value += (await load("/load/foot.njs", this)).value;
this.exit();
// test
