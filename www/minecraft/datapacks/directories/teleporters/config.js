const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "teleporters",
		version: [1, 0, 1],
		name: "Teleporters",
		compatibility: ["1.16"],
		description: `
			Drop a lodestone compass with crying obsidian placed directly both below and above it to create a teleporter to that compass's lodestone.
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "tpers.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
