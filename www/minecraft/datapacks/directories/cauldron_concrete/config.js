const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "cauldron_concrete",
		version: [1, 0, 2],
		name: "Cauldron Concrete",
		compatibility: ["1.15"],
		description: `
			Drop concrete powder into a cauldron filled with water to instantly harden all of it.
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "cauCon.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
