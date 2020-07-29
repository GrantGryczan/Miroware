const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "unlock_all_recipes",
		version: "1.0.0",
		name: "Unlock All Recipes",
		compatibility: ["1.15", "1.16"],
		description: `
			Automatically unlock all recipes as soon as you start playing.
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "unlAllRec.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
