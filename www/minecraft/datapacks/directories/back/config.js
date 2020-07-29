const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "back",
		version: [1, 0, 1],
		name: "Back",
		compatibility: ["1.16"],
		description: `
			Enter "/trigger back" to go back to the last location you teleported from.<br>
			<span class="more">
				Enter "/function back:config" to configure the time players must stand still before teleporting after running the back command.
			</span><br>
			<b>Requires Homes, Spawn, or TPA</b>
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "back.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
