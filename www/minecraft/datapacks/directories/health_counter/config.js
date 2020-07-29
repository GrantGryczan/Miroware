const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "health_counter",
		version: "1.0.0",
		name: "Health Counter",
		compatibility: ["1.13", "1.14", "1.15", "1.16"],
		description: `
			Display each player's health below their nametag.
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "heaCou.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
