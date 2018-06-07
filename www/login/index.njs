this.title = "Log in";
this.description = "Log into your Miroware account.";
this.tags = ["login", "log", "in", "signup", "sign", "up", "signin", "into", "to", "account", "user", "create"];
this.value = (await load("www/load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="index.css">
		<script src="https://www.google.com/recaptcha/api.js" async defer></script>`;
this.value += (await load("www/load/body", this)).value;
this.value += html`
			<form id="loginForm">
				<div class="mdc-text-field">
					<input id="email" name="email" class="mdc-text-field__input" type="email" required>
					<label class="mdc-floating-label" for="email">Email</label>
					<div class="mdc-line-ripple"></div>
				</div><br>
				<br>
				<button name="login" class="mdc-button mdc-button--outlined mdc-ripple spaced" type="submit">Log in</button><button name="signup" class="mdc-button mdc-ripple spaced" type="submit">Sign up</button>
			</form>
			<span id="signupForm" class="hidden">
				<div class="mdc-text-field mdc-text-field--disabled">
					<input id="email" name="email" class="mdc-text-field__input" type="email" value="$${this.user && this.user.email}" required disabled>
					<label class="mdc-floating-label alwaysFloat" for="email">Email</label>
					<div class="mdc-line-ripple"></div>
				</div><br>
				<div class="mdc-text-field">
					<input id="name" name="name" class="mdc-text-field__input" type="text" maxlength="32" required>
					<label class="mdc-floating-label" for="name">Username</label>
					<div class="mdc-line-ripple"></div>
				</div><br>
				<div class="mdc-text-field">
					<input id="birthday" name="birthday" class="mdc-text-field__input" type="date" max="${inputDate(new Date())}" required>
					<label class="mdc-floating-label alwaysFloat" for="birthday">Birthday</label>
					<div class="mdc-line-ripple"></div>
				</div><br>
				<br>
				<div class="g-recaptcha" data-sitekey="${youKnow.captcha.site}" data-theme="dark"></div>
			</span>`;
this.value += (await load("www/load/belt", this)).value;
this.value += html`
		<script src="index.js"></script>`;
this.value += (await load("www/load/foot", this)).value;
this.done();
