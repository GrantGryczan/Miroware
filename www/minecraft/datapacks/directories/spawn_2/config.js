const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "spawn",
		version: [2, 2, 0],
		name: "Spawn",
		compatibility: ["1.16"],
		description: `
			Enter "/trigger spawn" to teleport to the world spawn point.<br>
			<span class="more">
				Enter "/function spawn:config" to configure the time players must stand still before teleportation after running the spawn command.
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
