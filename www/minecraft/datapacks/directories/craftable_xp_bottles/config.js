const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "craftable_xp_bottles",
		version: "1.1.0",
		name: "Craftable XP Bottles",
		compatibility: ["1.16"],
		description: `
			Right-click an enchanting table with an empty bottle to fill it with some of your XP.<br>
			Smelt an XP bottle in a furnace to losslessly get your XP back.
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "craXPBot.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
