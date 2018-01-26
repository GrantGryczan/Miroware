this.title = "Twitter";
this.description = "Follow Miroware's tweets!";
this.tags = ["redirect", "link", "follow", "twitter", "tweet", "tweets", "status", "update", "updates"];
this.value = (await load("/load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("/load/body", this)).value;
this.value += html`
			Redirecting...`;
this.value += (await load("/load/belt", this)).value;
this.value += html`
		<script>
			location.replace("${this.redirect = "https://twitter.com/GrantGryczan"}");
		</script>`;
this.value += (await load("/load/foot", this)).value;
this.exit();
