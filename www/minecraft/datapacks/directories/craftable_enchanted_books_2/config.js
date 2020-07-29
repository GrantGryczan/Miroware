const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "craftable_enchanted_books",
		version: [2, 0, 1],
		name: "Craftable Enchanted Books",
		compatibility: ["1.16"],
		description: `
			To craft an enchanted book, drop one book, one ingredient, and a certain number of bottles o' enchanting into a cauldron.<br>
			Enter "/trigger craEncBoo" to get the recipe book.<br>
			<b>Requires Craftable XP Bottles</b>
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "craEncBoo.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
