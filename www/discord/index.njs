this.title = "Discord";
this.description = "Join Miroware's community!";
this.tags = ["redirect", "link", "discord", "invite", "invitation", "join"];
this.value = (await load("/load/head.njs", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("/load/body.njs", this)).value;
this.value += html`
			Redirecting...`;
this.value += (await load("/load/belt.njs", this)).value;
this.value += html`
		<script>
			location.replace("${this.redirect = "https://discordapp.com/oauth2/authorize?client_id=343262365195698177&scope=identify&response_type=code"}");
		</script>`;
this.value += (await load("/load/foot.njs", this)).value;
this.exit();
// test
