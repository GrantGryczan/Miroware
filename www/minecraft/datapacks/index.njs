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
for (const dataPack of [{
	id: "bat_membranes",
	title: "Bat Membranes",
	version: "1.0.0",
	compatibility: "1_15 1_16",
	description: html`
		Disable phantoms and get membranes from bats instead.
	`,
	tags: []
}, {
	id: "cauldron_concrete",
	title: "Cauldron Concrete",
	version: "1.0.2",
	compatibility: "1_15",
	description: html`
		Drop concrete powder into a cauldron filled with water to instantly harden all of it.
	`,
	tags: []
}, {
	id: "cauldron_concrete_2",
	title: "Cauldron Concrete",
	version: "2.0.2",
	compatibility: "1_16",
	description: html`
		Drop concrete powder into a cauldron filled with water to instantly harden all of it.
	`,
	tags: []
}, {
	id: "confetti_creepers",
	title: "Confetti Creepers",
	version: "1.1.1",
	compatibility: "1_14 1_15",
	description: html`
		There is a chance each creeper will explode into confetti and do no damage to blocks.<br>
		<div class="more">
			Enter "/trigger conCre" for details.<br>
			Enter "/function confetti_creepers:config" to configure that chance.
		</div>
	`,
	tags: ["confetti", "creepers", "creeper", "explode", "explosion", "explosions", "mobgriefing", "mob", "griefing", "disable"],
	video: "iREMnbsZuTg"
}, {
	id: "confetti_creepers_2",
	title: "Confetti Creepers",
	version: "2.1.1",
	compatibility: "1_16",
	description: html`
		There is a chance each creeper will explode into confetti and do no damage to blocks.<br>
		<div class="more">
			Enter "/trigger conCre" for details.<br>
			Enter "/function confetti_creepers:config" to configure that chance.
		</div>
	`,
	tags: ["confetti", "creepers", "creeper", "explode", "explosion", "explosions", "mobgriefing", "mob", "griefing", "disable"],
	video: "iREMnbsZuTg"
}, {
	id: "craftable_enchanted_books",
	title: "Craftable Enchanted Books",
	version: "1.0.1",
	compatibility: "1_14 1_15",
	description: html`
		To craft an enchanted book, drop one book, one ingredient, and a certain number of bottles o' enchanting into a cauldron.<br>
		Enter "/trigger craEncBoo" to get the recipe book.<br>
		<b>Requires Craftable XP Bottles</b>
	`,
	icon: "gif",
	tags: []
}, {
	id: "craftable_enchanted_books_2",
	title: "Craftable Enchanted Books",
	version: "2.0.1",
	compatibility: "1_16",
	description: html`
		To craft an enchanted book, drop one book, one ingredient, and a certain number of bottles o' enchanting into a cauldron.<br>
		Enter "/trigger craEncBoo" to get the recipe book.<br>
		<b>Requires Craftable XP Bottles</b>
	`,
	icon: "gif",
	tags: []
}, {
	id: "craftable_xp_bottles",
	title: "Craftable XP Bottles",
	version: "1.0.0",
	compatibility: "1_13 1_14 1_15",
	description: html`
		Crouch and jump on an enchanting table to fill a bottle in your inventory with some of your XP.
	`,
	icon: "gif",
	tags: []
}, {
	id: "craftable_xp_bottles_2",
	title: "Craftable XP Bottles",
	version: "2.0.0",
	compatibility: "1_16",
	description: html`
		Crouch and jump on an enchanting table to fill a bottle in your inventory with some of your XP.<br>
		Smelt an XP bottle in a furnace to losslessly get your XP back.
	`,
	icon: "gif",
	tags: []
}, {
	id: "custom_nether_portals",
	title: "Custom Nether Portals",
	version: "1.0.1",
	compatibility: "1_15",
	description: html`
		Ignite nether portals of any shape and size you like.<br>
		<div class="more">
			Enter "/trigger cusNetPor" for details.<br>
			Enter "/function custom_nether_portals:config" to configure the minimum and maximum nether portal size.
		</div>
	`,
	tags: []
}, {
	id: "custom_nether_portals_2",
	title: "Custom Nether Portals",
	version: "2.1.0",
	compatibility: "1_16",
	description: html`
		Ignite nether portals of any shape and size you like, or use crying obsidian in the portal frame.<br>
		<div class="more">
			Enter "/trigger cusNetPor" for details.<br>
			Enter "/function custom_nether_portals:config" to configure the minimum and maximum nether portal size.
		</div>
	`,
	tags: []
}, {
	id: "death_counter",
	title: "Death Counter",
	version: "1.0.0",
	compatibility: "1_13 1_14 1_15 1_16",
	description: html`
		Display each player's death count in the player list.<br>
		<b>Incompatible with TPA</b>
	`,
	tags: []
}, {
	id: "more_shulker_shells",
	title: "More Shulker Shells",
	version: "1.0.0",
	compatibility: "1_14 1_15 1_16",
	description: html`
		Shulkers drop 1-2 shells instead of 0-1, and they always drop 2 shells with Looting II.
	`,
	tags: []
}, {
	id: "graves",
	title: "Graves",
	version: "1.5.2",
	compatibility: "1_15",
	description: html`
		Retrieve your items and/or XP dropped on death from your grave by right-clicking it with an empty hand.<br>
		Hold crouch when you right-click to make it so only you can pick up the items.<br>
		<div class="more">
			Enter "/function graves:config" to configure whether grave robbing, graves collecting XP, and grave locating are enabled, or for an option to give yourself a grave key to forcibly open graves.
		</div>
	`,
	tags: ["graves", "grave", "gravestones", "gravestone", "stones", "stone", "player", "keepinventory", "keep", "inventory", "die", "death", "item", "items", "drop", "drops", "get", "back", "lava", "burn", "xisumavoid", "xisuma", "vanillatweaks", "vanilla", "tweaks"],
	video: "DWEVYImenj4"
}, {
	id: "graves_2",
	title: "Graves",
	version: "2.5.2",
	compatibility: "1_16",
	description: html`
		Retrieve your items and/or XP dropped on death from your grave by right-clicking it with an empty hand.<br>
		Hold crouch when you right-click to make it so only you can pick up the items.<br>
		<div class="more">
			Enter "/function graves:config" to configure whether grave robbing, graves collecting XP, and grave locating are enabled, or for an option to give yourself a grave key to forcibly open graves.
		</div>
	`,
	tags: ["graves", "grave", "gravestones", "gravestone", "stones", "stone", "player", "keepinventory", "keep", "inventory", "die", "death", "item", "items", "drop", "drops", "get", "back", "lava", "burn", "xisumavoid", "xisuma", "vanillatweaks", "vanilla", "tweaks"],
	video: "DWEVYImenj4"
}, {
	id: "health_counter",
	title: "Health Counter",
	version: "1.0.0",
	compatibility: "1_13 1_14 1_15 1_16",
	description: html`
		Display each player's health below their nametag.
	`,
	icon: "gif",
	tags: []
}, {
	id: "home_command",
	title: "Home Command",
	version: "1.2.1",
	compatibility: "1_15",
	description: html`
		Enter "/trigger sethome" or "/trigger sethome set &lt;ID&gt;" to set a home.<br>
		Enter "/trigger home" or "/trigger home set &lt;ID&gt;" to teleport there at any time.<br>
		<div class="more">
			Enter "/trigger homes" to list your homes.<br>
			Enter "/trigger namehome" or "/trigger namehome set &lt;ID&gt;" to name a home.<br>
			Enter "/trigger delhome" or "/trigger delhome set &lt;ID&gt;" to delete a home.<br>
			Enter "/function home_command:config" to configure the maximum number of homes allowed per player or the time to delay teleportation after running the home command.
		</div>
	`,
	tags: []
}, {
	id: "home_command_2",
	title: "Home Command",
	version: "2.2.1",
	compatibility: "1_16",
	description: html`
		Enter "/trigger sethome" or "/trigger sethome set &lt;ID&gt;" to set a home.<br>
		Enter "/trigger home" or "/trigger home set &lt;ID&gt;" to teleport there at any time.<br>
		<div class="more">
			Enter "/trigger homes" to list your homes.<br>
			Enter "/trigger namehome" or "/trigger namehome set &lt;ID&gt;" to name a home.<br>
			Enter "/trigger delhome" or "/trigger delhome set &lt;ID&gt;" to delete a home.<br>
			Enter "/function home_command:config" to configure the maximum number of homes allowed per player or the time to delay teleportation after running the home command.
		</div>
	`,
	tags: []
}, {
	id: "infinite_respawn_anchors",
	title: "Infinite Respawn Anchors",
	version: "1.0.0",
	compatibility: "1_16",
	description: html`
		If a respawn anchor has crying obsidian beneath it and an end crystal above it, it will never lose charge.
	`,
	icon: "gif",
	tags: []
}, {
	id: "invisible_item_frames",
	title: "Invisible Item Frames",
	version: "1.0.1",
	compatibility: "1_16",
	description: html`
		Drop an item frame into a cauldron with an extended potion of invisibility to craft an invisible item frame.
	`,
	tags: []
}, {
	id: "multiplayer_sleep",
	title: "Multiplayer Sleep",
	version: "1.0.4",
	compatibility: "1_15",
	description: html`
		Only a fraction of players in the overworld must sleep to skip the night and the rain.<br>
		<div class="more">
			Enter "/trigger mulSle" for details.<br>
			Enter "/function multiplayer_sleep:config" to configure the percent of players required to sleep or the color of the sleep progress bar.
		</div>
	`,
	tags: []
}, {
	id: "multiplayer_sleep_2",
	title: "Multiplayer Sleep",
	version: "2.0.4",
	compatibility: "1_16",
		description: html`
		Only a fraction of players in the overworld must sleep to skip the night and the rain.<br>
		<div class="more">
			Enter "/trigger mulSle" for details.<br>
			Enter "/function multiplayer_sleep:config" to configure the percent of players required to sleep or the color of the sleep progress bar.
		</div>
	`,
	tags: []
}, {
	id: "name_colors",
	title: "Name Colors",
	version: "1.0.1",
	compatibility: "1_13 1_14 1_15",
	description: html`
		Enter "/trigger color" to list the colors you can give to your username.
	`,
	tags: []
}, {
	id: "name_colors_2",
	title: "Name Colors",
	version: "2.0.1",
	compatibility: "1_16",
	description: html`
		Enter "/trigger color" to list the colors you can give to your username.
	`,
	tags: []
}, {
	id: "never_too_expensive",
	title: "Never Too Expensive",
	version: "1.0.2",
	compatibility: "1_14 1_15",
	description: html`
		Drop an item into a cauldron with one or more XP bottles to reduce the item's repair cost.<br>
		<div class="more">
			Enter "/trigger nevTooExp" for details.<br>
			Enter "/function never_too_expensive:config" to configure the number of XP bottles required or the repair cost reduced.
		</div>
	`,
	tags: []
}, {
	id: "never_too_expensive_2",
	title: "Never Too Expensive",
	version: "2.0.2",
	compatibility: "1_16",
	description: html`
		Drop an item into a cauldron with one or more XP bottles to reduce the item's repair cost.<br>
		<div class="more">
			Enter "/trigger nevTooExp" for details.<br>
			Enter "/function never_too_expensive:config" to configure the number of XP bottles required or the repair cost reduced.
		</div>
	`,
	tags: []
}, {
	id: "no_enderman_griefing",
	title: "No Enderman Griefing",
	version: "1.0.0",
	compatibility: "1_13 1_14 1_15 1_16",
	description: html`
		Disable endermen picking up blocks.
	`,
	tags: []
}, {
	id: "players_drop_heads",
	title: "Players Drop Heads",
	version: "1.0.1",
	compatibility: "1_14 1_15 1_16",
	description: html`
		Players drop their heads when killed by another player.
	`,
	tags: []
}, {
	id: "sky_dimension",
	title: "Sky Dimension",
	version: "1.0.0",
	compatibility: "1_16",
	description: html`
		Reach y=257 in the overworld to go to y=4 in the sky dimension. Reach y=-16 in the sky dimension to go to y=256 in the overworld.
	`,
	tags: []
}, {
	id: "spawn_command",
	title: "Spawn Command",
	version: "1.1.0",
	compatibility: "1_13 1_14 1_15",
	description: html`
		Enter "/trigger spawn" to teleport to the world spawn point.<br>
		<div class="more">
			Enter "/function spawn_command:config" to configure the time to delay teleportation after running the spawn command.
		</div>
	`,
	icon: "gif",
	tags: []
}, {
	id: "spawn_command_2",
	title: "Spawn Command",
	version: "2.1.0",
	compatibility: "1_16",
	description: html`
		Enter "/trigger spawn" to teleport to the world spawn point.<br>
		<div class="more">
			Enter "/function spawn_command:config" to configure the time to delay teleportation after running the spawn command.
		</div>
	`,
	icon: "gif",
	tags: []
}, {
	id: "teleporters",
	title: "Teleporters",
	version: "1.0.1",
	compatibility: "1_16",
	description: html`
		Drop a lodestone compass with crying obsidian placed directly both below and above it to create a teleporter to that compass's lodestone.
	`,
	tags: []
}, {
	id: "tpa",
	title: "TPA",
	version: "1.0.3",
	compatibility: "1_13 1_14 1_15",
	description: html`
		Enter "/trigger tpa set &lt;PID&gt;" to request to teleport to another player.<br>
		Each player's PID (player ID) number can be found in the player list by pressing Tab by default.<br>
		<b>Incompatible with Death Counter</b>
	`,
	tags: []
}, {
	id: "tpa_2",
	title: "TPA",
	version: "2.0.3",
	compatibility: "1_16",
	description: html`
		Enter "/trigger tpa set &lt;PID&gt;" to request to teleport to another player.<br>
		Each player's PID (player ID) number can be found in the player list by pressing Tab by default.<br>
		<b>Incompatible with Death Counter</b>
	`,
	tags: []
}, {
	id: "unlock_all_recipes",
	title: "Unlock All Recipes",
	version: "1.0.0",
	compatibility: "1_13 1_14 1_15 1_16",
	description: html`
		Automatically unlock all recipes as soon as you start playing.
	`,
	tags: []
}]) {
	for (const tag of dataPack.tags) {
		if (!this.tags.includes(tag)) {
			this.tags.push(tag);
		}
	}
	this.value += html`
					<div id="$${dataPack.id}" class="dataPack mdc-card ${dataPack.compatibility} hidden">
						<div class="mdc-card__text-section">
							<img class="mdc-card__icon" src="https://pipe.miroware.io/5b275bca357b306dc588877d/minecraft/datapacks/$${dataPack.id}.zip/pack.$${dataPack.icon || "png"}">
							<div class="mdc-card__title">$${dataPack.title}</div>
							<div class="mdc-card__subhead">$${dataPack.version}</div>
						</div>
						<div class="mdc-card__text-section">
							<div class="mdc-card__supporting-text">
								${dataPack.description}
							</div>
						</div>
						<div class="mdc-card__actions">${dataPack.video ? html`
							<a class="mdc-icon-button material-icons mdc-card__action mdc-card__action--button" href="https://youtu.be/$${dataPack.video}" target="_blank" title="Open video">play_circle_outline</a>` : ""}
							<a class="mdc-icon-button material-icons mdc-card__action mdc-card__action--button" href="https://pipe.miroware.io/5b275bca357b306dc588877d/minecraft/datapacks/$${dataPack.id}.zip" target="_blank" title="Download">file_download</a>
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
