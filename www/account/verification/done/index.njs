this.title = "Verify Email";
this.description = "Verify your File Garden account.";
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += this.req.query.result === "success" ? html`
				Your account has been successfully verified!<br>
				You are now logged in from this browser.` : html`
				Your verification code is invalid.`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += (await load("load/foot", this)).value;
this.done();
