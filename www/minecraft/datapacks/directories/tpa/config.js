const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "tpa",
		version: "1.1.0",
		name: "TPA",
		compatibility: ["1.15"],
		description: `
			Enter "/trigger tpa set &lt;PID&gt;" to request to teleport to another player.<br>
			Each player's PID (player ID) number can be found in the player list by pressing Tab by default.<br>
			<span class="more">
				Enter "/function tpa:config" to configure the time players must stand still before teleportation after their teleport request is accepted.<br>
			</span>
			<b>Incompatible with Death Counter</b>
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "tpa.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
