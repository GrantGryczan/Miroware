this.title = "Grant's Data Packs";
this.description = "All Minecraft data packs by Grant Gryczan";
this.tags = ["minecraft", "mc", "data", "pack", "packs", "datapack", "datapacks", "command", "commands", "block", "blocks", "1.13", "1.14", "1.15", "1.16"];
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
const dataPacks = [{
	id: "confetti_creepers",
	title: "Confetti Creepers",
	version: "1.0.0",
	compatibility: "1.14-1.16",
	description: "There is a chance each creeper will explode into confetti and do no damage to blocks.",
	video: "https://miroware.io/echo/?placeholder",
	tags: ["confetti", "creepers", "creeper", "explode", "explosion", "explosions", "burst", "mobgriefing", "mob", "griefing", "disable"]
}];
for (const dataPack of dataPacks) {
	this.tags.push(...dataPack.tags);
	this.value += html`
				<div class="mdc-card">
					<div class="mdc-card__text-section">
						<img class="mdc-card__icon" src="https://pipe.miroware.io/5b275bca357b306dc588877d/minecraft/datapacks/$${dataPack.id}/icon.png">
						<div class="mdc-card__title">$${dataPack.title}</div>
						<div class="mdc-card__subhead">$${dataPack.version} for Minecraft $${dataPack.compatibility}</div>
					</div>
					<div class="mdc-card__text-section">
						<div class="mdc-card__supporting-text">$${dataPack.description}</div>
					</div>
					<div class="mdc-card__actions">${dataPack.video ? html`
						<a class="mdc-icon-button material-icons mdc-card__action mdc-card__action--button" href="$${dataPack.video}" target="_blank">play_circle_outline</a>` : ""}
						<a class="mdc-icon-button material-icons mdc-card__action mdc-card__action--button" href="https://pipe.miroware.io/5b275bca357b306dc588877d/minecraft/datapacks/$${dataPack.id}" target="_blank">file_download</a>
					</div>
				</div>`;
}
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += (await load("load/foot", this)).value;
this.done();
