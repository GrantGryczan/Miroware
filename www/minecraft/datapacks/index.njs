this.title = "Grant's Data Packs";
this.description = "All Minecraft data packs by Grant Gryczan";
this.tags = ["minecraft", "mc", "data", "pack", "packs", "datapack", "datapacks", "command", "commands", "block", "blocks", "1.13", "1.14", "1.15", "1.16"];
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
for (const dataPack of [{
	id: "confetti_creepers",
	title: "Confetti Creepers",
	version: "1.1.0",
	compatibility: "1_14 1_15",
	description: 'There is a chance each creeper will explode into confetti and do no damage to blocks.<br>Enter "/trigger conCre" for details.<br>Enter "/function confetti_creepers:config" to configure that chance.',
	video: "iREMnbsZuTg",
	tags: ["confetti", "creepers", "creeper", "explode", "explosion", "explosions", "mobgriefing", "mob", "griefing", "disable"]
}, {
	id: "confetti_creepers_2",
	title: "Confetti Creepers",
	version: "2.1.0",
	compatibility: "1_16",
	description: 'There is a chance each creeper will explode into confetti and do no damage to blocks.<br>Enter "/trigger conCre" for details.<br>Enter "/function confetti_creepers:config" to configure that chance.',
	video: "iREMnbsZuTg",
	tags: ["confetti", "creepers", "creeper", "explode", "explosion", "explosions", "mobgriefing", "mob", "griefing", "disable"]
}, {
	id: "craftable_enchanted_books",
	title: "Craftable Enchanted Books",
	version: "1.0.0",
	compatibility: "1_14 1_15",
	description: `To craft an enchanted book, drop one book, one ingredient, and a certain number of bottles o' enchanting into a cauldron.<br>Enter "/trigger craEncBoo" to get the recipe book.<br><b>Requires Craftable XP Bottles</b>`,
	icon: "gif",
	tags: []
}, {
	id: "craftable_enchanted_books_2",
	title: "Craftable Enchanted Books",
	version: "2.0.0",
	compatibility: "1_16",
	description: `To craft an enchanted book, drop one book, one ingredient, and a certain number of bottles o' enchanting into a cauldron.<br>Enter "/trigger craEncBoo" to get the recipe book.<br><b>Requires Craftable XP Bottles</b>`,
	icon: "gif",
	tags: []
}, {
	id: "craftable_xp_bottles",
	title: "Craftable XP Bottles",
	version: "1.0.0",
	compatibility: "1_13 1_14 1_15",
	description: "Crouch and jump on an enchanting table to fill a bottle in your inventory with some of your XP.",
	icon: "gif",
	tags: []
}, {
	id: "craftable_xp_bottles_2",
	title: "Craftable XP Bottles",
	version: "2.0.0",
	compatibility: "1_16",
	description: "Crouch and jump on an enchanting table to fill a bottle in your inventory with some of your XP.<br>Smelt an XP bottle in a furnace to losslessly get your XP back.",
	icon: "gif",
	tags: []
}, {
	id: "death_counter",
	title: "Death Counter",
	version: "1.0.0",
	compatibility: "1_13 1_14 1_15 1_16",
	description: "Display each player's death count in the player list.<br><b>Incompatible with TPA</b>",
	tags: []
}, {
	id: "disable_enderman_griefing",
	title: "Disable Enderman Griefing",
	version: "1.0.0",
	compatibility: "1_13 1_14 1_15 1_16",
	description: "Disable endermen picking up blocks.",
	tags: []
}, {
	id: "graves",
	title: "Graves",
	version: "1.4.0",
	compatibility: "1_14 1_15",
	description: 'Retrieve your items and/or XP dropped on death from your grave by right-clicking it with an empty hand.<br>Hold crouch when you right-click to make it so only you can pick up the items.<br>Enter "/function graves:config" to configure whether grave robbing, graves collecting XP, and grave locating are enabled, or for an option to give yourself a grave key to forcibly open graves.',
	tags: []
}, {
	id: "graves_2",
	title: "Graves",
	version: "2.4.0",
	compatibility: "1_16",
	description: 'Retrieve your items and/or XP dropped on death from your grave by right-clicking it with an empty hand.<br>Hold crouch when you right-click to make it so only you can pick up the items.<br>Enter "/function graves:config" to configure whether grave robbing, graves collecting XP, and grave locating are enabled, or for an option to give yourself a grave key to forcibly open graves.',
	tags: []
}, {
	id: "health_counter",
	title: "Health Counter",
	version: "1.0.0",
	compatibility: "1_13 1_14 1_15 1_16",
	description: "Display each player's health below their nametag.",
	icon: "gif",
	tags: []
}, {
	id: "infinite_respawn_anchors",
	title: "Infinite Respawn Anchors",
	version: "1.0.0",
	compatibility: "1_16",
	description: "If a respawn anchor has crying obsidian beneath it and an end crystal above it, it will never lose charge.",
	icon: "gif",
	tags: []
}, {
	id: "invisible_item_frames",
	title: "Invisible Item Frames",
	version: "1.0.0",
	compatibility: "1_16",
	description: "Drop an item frame into a cauldron with an extended potion of invisibility to craft an invisible item frame.",
	tags: []
}, {
	id: "name_colors",
	title: "Name Colors",
	version: "1.0.0",
	compatibility: "1_13 1_14 1_15",
	description: 'Enter "/trigger color" to list the colors you can give to your username.',
	tags: []
}, {
	id: "name_colors_2",
	title: "Name Colors",
	version: "2.0.0",
	compatibility: "1_16",
	description: 'Enter "/trigger color" to list the colors you can give to your username.',
	tags: []
}, {
	id: "never_too_expensive",
	title: "Never Too Expensive",
	version: "1.0.0",
	compatibility: "1_14 1_15",
	description: `Drop an item into a cauldron with one or more XP bottles to reduce the item's repair cost.<br>Enter "/trigger nevTooExp" for details.<br>Enter "/function never_too_expensive:config" to configure the number of XP bottles required or the repair cost reduced.`,
	tags: []
}, {
	id: "never_too_expensive_2",
	title: "Never Too Expensive",
	version: "2.0.0",
	compatibility: "1_16",
	description: `Drop an item into a cauldron with one or more XP bottles to reduce the item's repair cost.<br>Enter "/trigger nevTooExp" for details.<br>Enter "/function never_too_expensive:config" to configure the number of XP bottles required or the repair cost reduced.`,
	tags: []
}, {
	id: "players_drop_heads",
	title: "Players Drop Heads",
	version: "1.0.0",
	compatibility: "1_14 1_15 1_16",
	description: "Players drop their heads when killed by another player.",
	tags: []
}, {
	id: "spawn_command",
	title: "Spawn Command",
	version: "1.0.0",
	compatibility: "1_13 1_14 1_15 1_16",
	description: 'Enter "/trigger spawn" to teleport to the world spawn point.',
	icon: "gif",
	tags: []
}, {
	id: "teleporters",
	title: "Teleporters",
	version: "1.0.0",
	compatibility: "1_16",
	description: "Drop a lodestone compass with crying obsidian placed directly both below and above it to create a teleporter to that compass's lodestone.",
	tags: []
}, {
	id: "tpa",
	title: "TPA",
	version: "1.0.0",
	compatibility: "1_13 1_14 1_15",
	description: `Enter "/trigger tpa set &lt;PID&gt;" to request to teleport to another player.<br>Each player's PID (player ID) number can be found in the player list by pressing Tab by default.<br><b>Incompatible with Death Counter</b>`,
	tags: []
}, {
	id: "tpa_2",
	title: "TPA",
	version: "2.0.0",
	compatibility: "1_16",
	description: `Enter "/trigger tpa set &lt;PID&gt;" to request to teleport to another player.<br>Each player's PID (player ID) number can be found in the player list by pressing Tab by default.<br><b>Incompatible with Death Counter</b>`,
	tags: []
}, {
	id: "unlock_all_recipes",
	title: "Unlock All Recipes",
	version: "1.0.0",
	compatibility: "1_13 1_14 1_15 1_16",
	description: "Automatically unlock all recipes as soon as you start playing.",
	tags: []
}]) {
	this.tags.push(...dataPack.tags);
	this.value += html`
					<div id="$${dataPack.id}" class="dataPack mdc-card ${dataPack.compatibility} hidden">
						<div class="mdc-card__text-section">
							<img class="mdc-card__icon" src="https://pipe.miroware.io/5b275bca357b306dc588877d/minecraft/datapacks/$${dataPack.id}/pack.$${dataPack.icon || "png"}">
							<div class="mdc-card__title">$${dataPack.title}</div>
							<div class="mdc-card__subhead">$${dataPack.version}</div>
						</div>
						<div class="mdc-card__text-section">
							<div class="mdc-card__supporting-text">${dataPack.description}</div>
						</div>
						<div class="mdc-card__actions">${dataPack.video ? html`
							<a class="mdc-icon-button material-icons mdc-card__action mdc-card__action--button" href="https://youtu.be/$${dataPack.video}" target="_blank" title="Open video">play_circle_outline</a>` : ""}
							<a class="mdc-icon-button material-icons mdc-card__action mdc-card__action--button" href="https://pipe.miroware.io/5b275bca357b306dc588877d/minecraft/datapacks/$${dataPack.id}" target="_blank" title="Download">file_download</a>
						</div>
					</div>`;
}
this.value += html`
			</div>`;
this.value += (await load("load/pagefoot", this)).value;
this.value += (await load("load/belt", this)).value;
this.value += html`
		<script src="script.js"></script>`;
this.value += (await load("load/foot", this)).value;
this.done();
