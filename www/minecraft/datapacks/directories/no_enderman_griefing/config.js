const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "no_enderman_griefing",
		version: "1.0.0",
		name: "No Enderman Griefing",
		compatibility: ["1.13", "1.14", "1.15", "1.16"],
		description: `
			Disable endermen picking up blocks.
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "noEndGri.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
