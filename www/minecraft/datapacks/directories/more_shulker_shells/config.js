const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "more_shulker_shells",
		version: "1.0.0",
		name: "More Shulker Shells",
		compatibility: ["1.14", "1.15", "1.16"],
		description: `
			Shulkers drop 1-2 shells instead of 0-1, and they always drop 2 shells with Looting II.
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "morShuShe.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
