this.title = "Grant's Data Packs";
this.description = "All Minecraft data packs by Grant Gryczan";
this.tags = ["minecraft", "mc", "data", "pack", "packs", "datapack", "datapacks", "command", "commands", "block", "blocks", "vanilla", "1.13", "1.14", "1.15", "1.16"];
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
this.value += html`
			<div id="versionContainer">
				<div id="versionSelect" class="mdc-select">
					<select id="versions" class="mdc-select__native-control">
						<option value="1_16" selected>Java Edition 1.16</option>
						<option value="1_15">Java Edition 1.15</option>
						<option value="1_14">Java Edition 1.14</option>
						<option value="1_13">Java Edition 1.13</option>
					</select>
					<div class="arrow"></div>
					<label class="mdc-floating-label alwaysFloat" for="versions">Minecraft Version</label>
					<div class="mdc-line-ripple"></div>
				</div>
			</div>
			<div id="dataPacks">`;
for (const id of await fs.readdir("www/minecraft/datapacks/directories")) {
	const dataPack = require(`./www/minecraft/datapacks/directories/${id}/config.js`).pack;
	if (!dataPack.hidden) {
		for (const tag of dataPack.tags) {
			if (!this.tags.includes(tag)) {
				this.tags.push(tag);
			}
		}
		this.value += html`
				<div id="$${id}" class="dataPack mdc-card ${dataPack.compatibility} hidden">
					<div class="mdc-card__text-section">
						<img class="mdc-card__icon" src="/minecraft/datapacks/directories/$${id}/pack.png">
						<div class="mdc-card__title">$${dataPack.name}</div>
						<div class="mdc-card__subhead">$${dataPack.version}</div>
					</div>
					<div class="mdc-card__text-section">
						<div class="mdc-card__supporting-text">
							${dataPack.description.replace(/[\n\t]/g, "")}
						</div>
					</div>
					<div class="mdc-card__actions">${dataPack.video ? html`
						<a class="mdc-icon-button material-icons mdc-card__action mdc-card__action--button" href="https://youtu.be/$${dataPack.video}" target="_blank" title="Open video">play_circle_outline</a>` : ""}
						<a class="mdc-icon-button material-icons mdc-card__action mdc-card__action--button" href="/minecraft/datapacks/files/$${id}.zip" target="_blank" title="Download">file_download</a>
					</div>
				</div>`;
	}
}
this.value += html`
			</div>
			<div id="credit">
				Data packs compiled using <a target="_blank" href="https://github.com/IanSSenne/mcbuild">MC-Build</a>
			</div>`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
