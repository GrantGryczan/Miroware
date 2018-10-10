this.title = "Account Verification";
this.description = "Verify your Miroware account.";
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				${this.req.query.result === "success" ? "Your account has been successfully verified!" : "Your verification code is invalid."}`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += (await load("load/foot", this)).value;
this.done();
