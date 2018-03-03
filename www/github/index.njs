this.title = "GitHub";
this.description = "Engage in Miroware's source code!";
this.tags = ["redirect", "link", "git", "github", "hub", "repository", "repo", "open", "source", "code"];
this.value = (await load("/load/head", this)).value;
this.value += (await load("/load/body", this)).value;
this.value += html`
			Redirecting...`;
this.value += (await load("/load/belt", this)).value;
this.value += html`
		<script>
			location.replace("${this.redir = "https://github.com/GrantGryczan"}");
		</script>`;
this.value += (await load("/load/foot", this)).value;
this.exit();
