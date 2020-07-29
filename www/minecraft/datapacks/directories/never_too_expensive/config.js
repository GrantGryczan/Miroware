const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "never_too_expensive",
		version: [1, 0, 2],
		name: "Never Too Expensive",
		compatibility: ["1.15"],
		description: `
			Drop an item into a cauldron with one or more XP bottles to reduce the item's repair cost.<br>
			<span class="more">
				Enter "/trigger nevTooExp" for details.<br>
				Enter "/function never_too_expensive:config" to configure the number of XP bottles required or the repair cost reduced.
			</span>
		`,
		tags: []
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "nevTooExp.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
