this.title = "Mimic";
this.description = "Teach an AI how to speak, sort of.";
this.tags = ["ai", "artificial", "intelligence", "bot", "learn", "learning", "write", "writing", "language", "speech", "speak", "talk", "talking", "mimic", "imitate", "imitation"];
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				<div class="mdc-text-field mdc-text-field--textarea mdc-text-field--fullwidth">
					<textarea id="input" class="mdc-text-field__input"></textarea>
					<label class="mdc-floating-label" for="input">Input</label>
					<div class="mdc-line-ripple"></div>
				</div>
				<button id="start" class="mdc-button mdc-button--raised mdc-ripple" type="submit" disabled>Generate</button><br>
				<div class="mdc-text-field mdc-text-field--textarea mdc-text-field--fullwidth">
					<textarea id="output" class="mdc-text-field__input" readonly></textarea>
					<label class="mdc-floating-label alwaysFloat" for="input">Output</label>
					<div class="mdc-line-ripple"></div>
				</div>`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
