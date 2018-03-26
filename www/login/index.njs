this.title = "Log in";
this.description = "Log into your Miroware account.";
this.tags = ["login", "log", "in", "into", "to", "account", "profile", "my"];
this.value = (await load("www/load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">`;
this.value += (await load("www/load/body", this)).value;
this.value += html`
			<form id="loginform">
				<div class="mdc-text-field">
					<input id="email" class="mdc-text-field__input" type="email" required>
					<label class="mdc-floating-label" for="email">Email</label>
					<div class="mdc-line-ripple"></div>
				</div><br>
				<br>
				<button class="mdc-button mdc-button--stroked ripple" type="submit">Log in</button>
			</form>`;
this.value += (await load("www/load/belt", this)).value;
this.value += html`
		<script src="index.js"></script>`;
this.value += (await load("www/load/foot", this)).value;
this.done();
