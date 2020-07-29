const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "pocket_dimensions",
		version: [1, 0, 0],
		name: "Pocket Dimensions",
		compatibility: ["1.16"],
		description: `
			
		`,
		tags: [],
		hidden: true
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "pocDim.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
