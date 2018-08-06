if(notLoggedIn(this)) {
	return;
}
this.title = "Account";
this.description = "Do things about your account.";
this.tags = ["account", "user", "settings", "preferences", "options"];
this.value = (await load("load/head", this)).value;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
const nameCooldown = this.now - this.user.nameCooldown < 86400000;
this.value += html`
				<form id="form">
					<div class="mdc-text-field mdc-text-field--disabled">
						<input id="email" name="email" class="mdc-text-field__input" type="email" value="$${this.user.email}" required disabled>
						<label class="mdc-floating-label" for="email">Email</label>
						<div class="mdc-line-ripple"></div>
					</div><br>
					<div class="mdc-form-field">
						<div class="mdc-checkbox">
							<input id="publicEmail" name="publicEmail" class="mdc-checkbox__native-control" type="checkbox"${this.user.publicEmail ? " checked" : ""}>
							<div class="mdc-checkbox__background"></div>
						</div>
						<label for="publicEmail">Show email publicly</label>
					</div><br>
					<div class="mdc-text-field${nameCooldown ? " mdc-text-field--disabled" : ""}">
						<input id="name" name="name" class="mdc-text-field__input" type="text" value="$${this.user.name}" maxlength="32" required${nameCooldown ? " disabled" : ""}>
						<label class="mdc-floating-label" for="name">Username</label>
						<div class="mdc-line-ripple"></div>
					</div>
					<p class="mdc-text-field-helper-text">You may only set your username once per day.</p>
					<button id="manageConnections" class="mdc-button mdc-button--unelevated mdc-button--dense">Manage Connections</button><br>
					<div class="mdc-text-field">
						<input id="birth" name="birth" class="mdc-text-field__input" type="date" value="${inputDate(new Date(this.user.birth))}" max="${inputDate(new Date())}" required>
						<label class="mdc-floating-label alwaysFloat" for="birth">Birthday</label>
						<div class="mdc-line-ripple"></div>
					</div><br>
					<div class="mdc-text-field mdc-text-field--textarea">
						<textarea id="desc" name="desc" class="mdc-text-field__input" rows="6" cols="48" maxlength="16384">$${this.user.desc}</textarea>
						<label class="mdc-floating-label" for="desc">Description</label>
						<div class="mdc-line-ripple"></div>
					</div><br>
					<br>
					<button id="save" class="mdc-button mdc-button--raised spaced mdc-ripple" type="submit" disabled>Save</button><button id="delete" class="mdc-button spaced mdc-ripple">Delete</button><button id="download" class="mdc-button spaced mdc-ripple">Delete</button>
				</form>`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
