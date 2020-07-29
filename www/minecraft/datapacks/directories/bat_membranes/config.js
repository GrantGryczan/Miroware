const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "bat_membranes",
		version: [1, 0, 0],
		name: "Bat Membranes",
		compatibility: ["1.15", "1.16"],
		description: `
			Disable phantoms and get membranes from bats instead.
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "batMem.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
