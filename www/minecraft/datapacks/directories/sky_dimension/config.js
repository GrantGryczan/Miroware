const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "sky_dimension",
		version: [1, 0, 1],
		name: "Sky Dimension",
		compatibility: ["1.16"],
		description: `
			Reach y=257 in the overworld to go to y=4 in the sky dimension. Reach y=-16 in the sky dimension to go to y=256 in the overworld.
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "skyDim.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
