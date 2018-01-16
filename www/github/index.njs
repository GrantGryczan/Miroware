this.title = "GitHub";
this.description = "Engage in Miroware's source code!";
this.tags = ["redirect", "link", "git", "github", "hub", "repository", "repo", "open", "source", "code"];
this.value = (await load("/load/head.njs", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("/load/body.njs", this)).value;
this.value += html`
			Redirecting...`;
this.value += (await load("/load/belt.njs", this)).value;
this.value += html`
		<script>
			location.replace("${this.redirect = "https://github.com/Miroware8"}");
		</script>`;
this.value += (await load("/load/foot.njs", this)).value;
this.exit();
// test
