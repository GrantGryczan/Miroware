this.title = "Concat";
this.description = "Customize your own URLs on our domain to shorten, randomize, and redirect your links, free subdomains and paths included.";
this.tags = ["concat", "url", "urls", "link", "links", "linked", "linking", "domain", "domains", "custom", "customize", "redirect", "free", "subdomain", "subdomains", "random", "randomize", "randomizer", "randomized", "image", "images"];
if(this.user) {
	this.data = this.user.concats;
}
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				<form id="form" autocomplete="off">${(this.user ? html`
					<div>
						<div class="mdc-select">
							<select id="saves" class="mdc-select__native-control">
								<option value="" selected>New</option>
							</select>
							<label class="mdc-floating-label alwaysFloat">Concat</label>
							<div class="mdc-line-ripple"></div>
						</div>
					</div>` : "")}
					<div id="url">
						<span id="sub"${this.req.query.sub ? "" : ' class="hidden"'}>
							<div class="mdc-text-field">
								<input name="sub" class="mdc-text-field__input" type="text" value="${this.req.query.sub || ""}" maxlength="63" spellcheck="false">
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
						Target URL(s) <button id="help" class="mdc-icon-button inline material-icons">help</button><br>
						<div id="entries"></div>
						<button id="addEntry" class="mdc-button margined">
							<i class="mdc-button__icon material-icons">add</i>Add
						</button>
					</div>
					<div>
						<button id="save" class="mdc-button mdc-button--raised spaced mdc-ripple" type="submit">Create</button><button id="delete" class="mdc-button spaced hidden">Delete</button>
					</div>
					<div id="details">
						<b>$${(await users.aggregate([{
							$project: {
								size: {
									$size: "$concats"
								}
							}
						}, {
							$group: {
								_id: null,
								count: {
									$sum: "$size"
								}
							}
						}]).next()).count}</b> concats have been created in total!
					</div>
				</form>`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
