this.title = "Link Hat";
this.description = "Customize your own URLs on our domain to shorten, randomize, and redirect your links, free subdomains and paths included.";
this.tags = ["linkhat", "hat", "url", "urls", "link", "links", "linked", "linking", "domain", "domains", "custom", "customize", "redirect", "free", "subdomain", "subdomains", "random", "randomize", "randomizer", "randomized", "image", "images", "rotate", "rotator", "rotation"];
this.showAds = true;
if (this.user) {
	this.data = this.user.concats;
}
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				<form id="form" autocomplete="off">${(this.user ? html`
					<div class="mdc-select">
						<select id="saves" class="mdc-select__native-control">
							<option value="" selected>New</option>
						</select>
						<div class="arrow"></div>
						<label class="mdc-floating-label alwaysFloat" for="saves">Link</label>
						<div class="mdc-line-ripple"></div>
					</div>` : "")}
					<div id="url">
						<span id="sub"${this.req.query.sub ? "" : ' class="hidden"'}>
							<div class="mdc-text-field">
								<input name="sub" class="mdc-text-field__input" type="text" value="${this.req.query.sub || ""}" maxlength="63" spellcheck="false">
								<div class="mdc-line-ripple"></div>
						</div>.</span>linkh.at/<div class="mdc-text-field">
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
						Target URL(s) <button id="help" class="mdc-icon-button inline material-icons">help</button><br>
						<div id="entries"></div>
						<button id="addEntry" class="mdc-button margined">
							<i class="mdc-button__icon material-icons">add</i>Add
						</button>
					</div>
					<div>
						<button id="save" class="mdc-button mdc-button--raised spaced mdc-ripple" type="submit">Create</button><button id="delete" class="mdc-button spaced hidden">Delete</button>
					</div>
					<div id="details" style="opacity: 1;">
						<div style="color: red;">
							<strong>Warning:</strong> Unfortunately, all linkh.at links are not permanent.
						</div>
						<div style="opacity: 0.4;">
							The .at top-level domain registry previously published the home address I'm legally required to give them in the domain's public WHOIS info despite <a href="https://www.nic.at/en/good_to_know/legal-backgrounds/privacy-policy" target="_blank">their privacy policy</a> saying they won't do that. It has since been redacted, but I no longer trust the .at registry with my personal information, so I plan to move Link Hat's functionality to File Garden itself under the file.garden domain instead. This will likely be in several months as I'm prioritizing development of File Garden itself. Sorry for the inconvenience and future link breakage.
						</div>
					</div>
				</form>`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
