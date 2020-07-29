const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "spawn",
		version: "1.2.0",
		name: "Spawn",
		compatibility: ["1.15"],
		description: `
			Enter "/trigger spawn" to teleport to the world spawn point.<br><br>
			<span class="more">
				Enter "/function spawn:config" to configure the time players must stand still before teleporting after running the spawn command.
			</span>
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "spawn.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
