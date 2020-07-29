const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "invisible_item_frames",
		version: [1, 1, 0],
		name: "Invisible Item Frames",
		compatibility: ["1.16"],
		description: `
			Place an extended potion of invisibility into an item frame to make it invisible whenever it holds an item.
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "invIteFra.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
