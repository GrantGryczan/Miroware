this.title = "YouTube";
this.description = "Watch Miroware's videos!";
this.tags = ["redirect", "link", "youtube", "channel"];
this.value = (await load("/load/head.njs", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("/load/body.njs", this)).value;
this.value += html`
		Redirecting...`;
this.value += (await load("/load/belt.njs", this)).value;
this.value += html`
		<script>
			location.replace("${this.redirect = "https://www.youtube.com/c/Miroware"}");
		</script>`;
this.value += (await load("/load/foot.njs", this)).value;
this.exit();
