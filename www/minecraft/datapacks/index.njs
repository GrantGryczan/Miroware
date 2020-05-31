this.title = "Grant's Data Packs";
this.description = "All Minecraft data packs by Grant Gryczan";
this.tags = ["minecraft", "mc", "data", "pack", "packs", "datapack", "datapacks", "command", "commands", "block", "blocks", "1.13", "1.14", "1.15", "1.16"];
this.value = (await load("load/head", this)).value;
this.value += html`
		<link rel="stylesheet" href="style.css">`;
this.value += (await load("load/body", this)).value;
this.value += (await load("load/pagehead", this)).value;
for (const dataPack of [{
	id: "confetti_creepers",
	title: "Confetti Creepers",
	version: "1.0.0",
	compatibility: "1.14-1.16",
	description: "There is a chance each creeper will explode into confetti and do no damage to blocks.",
	video: "https://miroware.io/echo/?placeholder",
	tags: ["confetti", "creepers", "creeper", "explode", "explosion", "explosions", "burst", "mobgriefing", "mob", "griefing", "disable"]
}, {
	id: "craftable_enchanted_books",
	title: "Craftable Enchanted Books",
	version: "1.0.0",
	compatibility: "1.16",
	description: "To craft an enchanted book, drop one book, one ingredient, and a certain number of bottles o' enchanting into a cauldron.",
	icon: "gif",
	tags: []
}, {
	id: "craftable_xp_bottles",
	title: "Craftable XP Bottles",
	version: "1.0.0",
	compatibility: "1.16",
	description: "Crouch and jump on an enchanting table to fill a bottle in your inventory with some of your XP.<br>Smelt an XP bottle in a furnace to losslessly store its XP therein.",
	icon: "gif",
	tags: []
}, {
	id: "death_counter",
	title: "Death Counter",
	version: "1.0.0",
	compatibility: "1.16",
	description: "Display each player's death count in the player list.",
	tags: []
}, {
	id: "graves",
	title: "Graves",
	version: "1.0.0",
	compatibility: "1.16",
	description: "Retrieve any items a player drops on death from the grave created at their death location.",
	tags: []
}, {
	id: "health_counter",
	title: "Health Counter",
	version: "1.0.0",
	compatibility: "1.16",
	description: "Display each player's health below their nametag.",
	icon: "gif",
	tags: []
}, {
	id: "infinite_respawn_anchors",
	title: "Infinite Respawn Anchors",
	version: "1.0.0",
	compatibility: "1.16",
	description: "If a respawn anchor has crying obsidian beneath it and an end crystal above it, it will never lose charge.",
	icon: "gif",
	tags: []
}, {
	id: "invisible_item_frames",
	title: "Invisible Item Frames",
	version: "1.0.0",
	compatibility: "1.16",
	description: "Drop an item frame into a cauldron with an extended potion of invisibility to craft an invisible item frame.",
	tags: []
}, {
	id: "name_colors",
	title: "Name Colors",
	version: "1.0.0",
	compatibility: "1.16",
	description: 'Enter "/trigger color" to list the colors you can give to your username.',
	tags: []
}, {
	id: "never_too_expensive",
	title: "Never Too Expensive",
	version: "1.0.0",
	compatibility: "1.16",
	description: "Drop an item into a cauldron with one or more XP bottles to reduce the item's repair cost.",
	tags: []
}, {
	id: "players_drop_heads",
	title: "Players Drop Heads",
	version: "1.0.0",
	compatibility: "1.16",
	description: "Players drop their heads when killed by another player.",
	tags: []
}, {
	id: "spawn_command",
	title: "Spawn Command",
	version: "1.0.0",
	compatibility: "1.16",
	description: 'Enter "/trigger spawn" to teleport to the world spawn point.',
	icon: "gif",
	tags: []
}, {
	id: "teleporters",
	title: "Teleporters",
	version: "1.0.0",
	compatibility: "1.16",
	description: "Drop a lodestone compass with crying obsidian placed directly both above and below it to create a teleporter to that compass's lodestone.",
	tags: []
}, {
	id: "tpa",
	title: "TPA",
	version: "1.0.0",
	compatibility: "1.16",
	description: `Enter "/trigger tpa set &lt;PID&gt;" to request to teleport to another player.<br>Each player's PID (player ID) number can be found in the player list by pressing Tab by default.`,
	tags: []
}, {
	id: "unlock_all_recipes",
	title: "Unlock All Recipes",
	version: "1.0.0",
	compatibility: "1.16",
	description: "Automatically unlock all recipes as soon as you start playing.",
	tags: []
}]) {
	this.tags.push(...dataPack.tags);
	this.value += html`
				<div id="$${dataPack.id}" class="mdc-card">
					<div class="mdc-card__text-section">
						<img class="mdc-card__icon" src="https://pipe.miroware.io/5b275bca357b306dc588877d/minecraft/datapacks/$${dataPack.id}/icon.$${dataPack.icon || "png"}">
						<div class="mdc-card__title">$${dataPack.title}</div>
						<div class="mdc-card__subhead">$${dataPack.version} for Minecraft $${dataPack.compatibility}</div>
					</div>
					<div class="mdc-card__text-section">
						<div class="mdc-card__supporting-text">${dataPack.description}</div>
					</div>
					<div class="mdc-card__actions">${dataPack.video ? html`
						<a class="mdc-icon-button material-icons mdc-card__action mdc-card__action--button" href="$${dataPack.video}" target="_blank" title="Open Video">play_circle_outline</a>` : ""}
						<a class="mdc-icon-button material-icons mdc-card__action mdc-card__action--button" href="https://pipe.miroware.io/5b275bca357b306dc588877d/minecraft/datapacks/$${dataPack.id}" target="_blank" title="Download">file_download</a>
					</div>
				</div>`;
}
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += (await load("load/foot", this)).value;
this.done();
