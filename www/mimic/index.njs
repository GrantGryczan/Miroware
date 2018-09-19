this.title = "Mimic";
this.description = "Teach an AI how to speak, sort of.";
this.tags = ["ai", "artificial", "intelligence", "bot", "learn", "learning", "write", "writing", "language", "speech", "speak", "talk", "talking", "mimic", "imitate", "imitation"];
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
				<p>Miroware Mimic is a makeshift AI that does a poor job at looking for patterns in text to generate more text.</p>
				<div class="mdc-text-field mdc-text-field--textarea mdc-text-field--fullwidth">
					<textarea id="input" class="mdc-text-field__input" rows="8"></textarea>
					<label class="mdc-floating-label" for="input">Input</label>
					<div class="mdc-line-ripple"></div>
				</div>
				<button id="start" class="mdc-button mdc-button--raised mdc-ripple">Generate</button><br>
				<div class="mdc-text-field mdc-text-field--textarea mdc-text-field--fullwidth">
					<textarea id="output" class="mdc-text-field__input" rows="8" readonly></textarea>
					<label class="mdc-floating-label alwaysFloat" for="output">Output</label>
					<div class="mdc-line-ripple"></div>
				</div>
				<br>
				<div class="mdc-text-field mdc-text-field--dense spaced">
					<input id="depthInput" class="mdc-text-field__input" type="number" min="1" max="2000" value="3"></input>
					<label class="mdc-floating-label" for="spitInput">Depth</label>
					<div class="mdc-line-ripple"></div>
				</div><div class="mdc-text-field mdc-text-field--dense spaced">
					<input id="spitInput" class="mdc-text-field__input" value="([^\\w])"></input>
					<label class="mdc-floating-label" for="spitInput">Split</label>
					<div class="mdc-line-ripple"></div>
				</div><button id="help" class="mdc-icon-button material-icons spaced">help</button>`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
