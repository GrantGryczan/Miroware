const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "multiplayer_sleep",
		version: [1, 0, 4],
		name: "Multiplayer Sleep",
		compatibility: ["1.15"],
		description: `
			Only a fraction of players in the overworld must sleep to skip the night and the rain.<br>
			<span class="more">
				Enter "/trigger mulSle" for details.<br>
				Enter "/function multiplayer_sleep:config" to configure the percent of players required to sleep or the color of the sleep progress bar.
			</span>
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "mulSle.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
