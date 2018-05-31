if(notLoggedIn(this)) {
	return;
}
this.title = "Settings";
this.description = "Set your settings.";
this.tags = ["settings", "preferences", "account", "user"];
this.value = (await load("www/load/head", this)).value;
this.value += (await load("www/load/body", this)).value;
const user = await users.findOne({
	_id: this.req.session.user
});
const nameCooldown = Date.now()-user.nameCooldown < 86400000;
this.value += html`
			<div id="page">
				<form id="settings">
					<div class="mdc-text-field mdc-text-field--disabled">
						<input id="email" name="email" class="mdc-text-field__input" type="email" value="$${user.email}" required disabled>
						<label class="mdc-floating-label" for="email">Email</label>
						<div class="mdc-line-ripple"></div>
					</div><br>
					<div class="mdc-text-field${nameCooldown ? " mdc-text-field--disabled" : ""}">
						<input id="name" name="name" class="mdc-text-field__input" type="text" value="$${user.name}" maxlength="32" required${nameCooldown ? " disabled" : ""}>
						<label class="mdc-floating-label" for="name">Username</label>
						<div class="mdc-line-ripple"></div>
					</div>
					<p class="mdc-text-field-helper-text">You may only change your username once per day.</p>
					<div class="mdc-text-field">
						<input id="birth" name="birth" class="mdc-text-field__input" type="date" value="${inputDate(new Date(user.birth))}" max="${inputDate(new Date())}" required>
						<label class="mdc-floating-label alwaysfloat" for="birthday">Birthday</label>
						<div class="mdc-line-ripple"></div>
					</div><br>
					<br>
					<button id="save" name="save" class="mdc-button mdc-button--raised ripple" type="submit" disabled>Save</button>
				</form>
			</div>`;
this.value += (await load("www/load/belt", this)).value;
this.value += html`
		<script src="index.js"></script>`;
this.value += (await load("www/load/foot", this)).value;
this.done();
