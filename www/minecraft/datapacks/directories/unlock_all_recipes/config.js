const builder = require("../../builder.js");
module.exports = {
	pack: require("./pack.js"),
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
