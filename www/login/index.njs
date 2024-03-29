if (this.user) {
	this.redirect = this.req.query.dest && !this.req.query.dest.includes("//") ? this.req.query.dest : "/";
	this.done();
	return;
}
this.title = "Login";
this.description = "Log into your File Garden account.";
this.tags = ["login", "log", "in", "signup", "sign", "up", "signin", "into", "to", "account", "user", "create"];
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">
		<script src="https://www.google.com/recaptcha/api.js" async defer></script>`;
this.value += (await load("load/body", this)).value;
this.value += html`
			<form id="loginForm">
				<div class="mdc-text-field">
					<input id="email" name="email" class="mdc-text-field__input" type="email" autofocus required>
					<label class="mdc-floating-label" for="email">Email</label>
					<div class="mdc-line-ripple"></div>
				</div><br>
				<br>
				<button name="login" class="mdc-button mdc-button--outlined spaced mdc-ripple" type="submit">Log in</button><button name="signup" class="mdc-button spaced mdc-ripple" type="submit">Sign up</button>
			</form>
			<span class="hidden">
				<span id="signupForm">
					<div class="mdc-text-field">
						<input id="email2" name="email" class="mdc-text-field__input" type="email" required>
						<label class="mdc-floating-label" for="email2">Email</label>
						<div class="mdc-line-ripple"></div>
					</div><br>
					<div class="mdc-text-field">
						<input id="name" name="name" class="mdc-text-field__input" type="text" maxlength="32" required>
						<label class="mdc-floating-label" for="name">Username</label>
						<div class="mdc-line-ripple"></div>
					</div><br>
					<div class="mdc-text-field">
						<input id="birth" name="birth" class="mdc-text-field__input" type="text" data-type="date" required>
						<label class="mdc-floating-label" for="birth">Birthdate</label>
						<div class="mdc-line-ripple"></div>
					</div><p class="mdc-text-field-helper-text"></p>
				</span>
				<div class="g-recaptcha" data-sitekey="${youKnow.captcha.site}" data-badge="inline" data-size="invisible" data-callback="captchaCallback"></div>
			</span>`;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
