this.cache = true;
this.title = "Twitch";
this.description = "Watch Miroware livestream!";
this.tags = ["redirect", "link", "follow", "twitch", "live", "stream", "livestream", "livestreaming", "streaming"];
this.value = (await load("load/head", this)).value;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				Redirecting...`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script>
			location.replace("${this.redir = "https://www.twitch.tv/grantgryczan"}");
		</script>`;
this.value += (await load("load/foot", this)).value;
this.done();
