const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "name_colors",
		version: "1.0.1",
		name: "Name Colors",
		compatibility: ["1.15"],
		description: `
			Enter "/trigger color" to list the colors you can give to your username.
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "namCol.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
