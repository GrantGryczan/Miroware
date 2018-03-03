this.title = "YouTube";
this.description = "Watch Miroware's videos!";
this.tags = ["redirect", "link", "youtube", "channel"];
this.value = (await load("/load/head", this)).value;
this.value += (await load("/load/body", this)).value;
this.value += html`
			Redirecting...`;
this.value += (await load("/load/belt", this)).value;
this.value += html`
		<script>
			location.replace("${this.redir = "https://www.youtube.com/c/Miroware"}");
		</script>`;
this.value += (await load("/load/foot", this)).value;
this.exit();
