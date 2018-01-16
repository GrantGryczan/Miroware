this.title = "Patreon";
this.description = "Support Miroware's content!";
this.tags = ["redirect", "link", "patreon", "support", "donate", "donation", "donations", "contribute", "contribution", "contributions", "money"];
this.value = (await load("/load/head.njs", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("/load/body.njs", this)).value;
this.value += html`
			Redirecting...`;
this.value += (await load("/load/belt.njs", this)).value;
this.value += html`
		<script>
			location.replace("${this.redirect = "https://www.patreon.com/miroware"}");
		</script>`;
this.value += (await load("/load/foot.njs", this)).value;
this.exit();
// test
