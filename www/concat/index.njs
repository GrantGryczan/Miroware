this.title = "Concat";
this.description = "Customize your own URLs on our domain to shorten, randomize, and redirect your links, free subdomains and paths included.";
this.tags = ["concat", "url", "urls", "link", "links", "linked", "linking", "domain", "domains", "custom", "customize", "redirect", "free", "subdomain", "subdomains", "random", "randomize", "randomizer", "randomized", "image", "images"];
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				<form id="config" autocomplete="off">
					<div id="url">
						<span id="sub"${this.req.query.sub ? "" : ' class="hidden"'}>
							<div class="mdc-text-field">
								<input name="sub" class="mdc-text-field__input" type="text" value="${this.req.query.sub || ""}" maxlength="63" spellcheck="false" autocomplete="on">
								<div class="mdc-line-ripple"></div>
						</div>.</span>miro.gg/<div class="mdc-text-field">
							<input name="val" class="mdc-text-field__input" type="text" value="${this.req.query.val || ""}" maxlength="255" spellcheck="false"${this.req.query.val ? "" : " autofocus"}>
							<div class="mdc-line-ripple"></div>
						</div>
					</div>
					<div id="flags">
						<div class="mdc-form-field spaced">
							<div class="mdc-checkbox">
								<input id="enableSub" name="enableSub" class="mdc-checkbox__native-control" type="checkbox"${this.req.query.sub ? " checked" : ""}>
								<div class="mdc-checkbox__background"></div>
							</div>
							<label for="enableSub">Custom subdomain</label>
						</div><div class="mdc-form-field spaced">
							<div class="mdc-checkbox">
								<input id="anon" name="anon" class="mdc-checkbox__native-control" type="checkbox"${this.req.query.anon === "true" ? " checked" : ""}>
								<div class="mdc-checkbox__background"></div>
							</div>
							<label for="anon">Anonymous</label>
						</div>
					</div>
					<div id="targets">
						URL Target(s) <button id="help" class="mdc-icon-button inline material-icons">help</button><br>
						<div id="entries"></div>
						<button id="addEntry" class="mdc-button">
							<i class="mdc-button__icon material-icons">add</i>Add
						</button>
					</div>
					<button id="save" class="mdc-button mdc-button--raised mdc-ripple" type="submit">Create</button>
				</form>`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
