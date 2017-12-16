this.title = "Twitter";
this.description = "Follow Miroware's tweets!";
this.tags = ["redirect", "link", "follow", "twitter", "tweet", "tweets", "status", "update", "updates"];
this.value = (await load("/load/head.njs", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("/load/body.njs", this)).value;
this.value += html`
		Redirecting...`;
this.value += (await load("/load/belt.njs", this)).value;
this.value += html`
		<script>
			location.replace("${this.redirect = "https://twitter.com/Miroware8"}");
		</script>`;
this.value += (await load("/load/foot.njs", this)).value;
this.exit();
