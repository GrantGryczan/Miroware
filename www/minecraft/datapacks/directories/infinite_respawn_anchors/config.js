const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "infinite_respawn_anchors",
		version: [1, 0, 0],
		name: "Infinite Respawn Anchors",
		compatibility: ["1.16"],
		description: `
			If a respawn anchor has crying obsidian beneath it and an end crystal above it, it will never lose charge.
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "infResAnc.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
