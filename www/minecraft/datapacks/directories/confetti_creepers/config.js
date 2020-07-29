const builder = require("../../builder.js");
module.exports = {
	pack: {
		namespace: "confetti_creepers",
		version: [1, 1, 1],
		name: "Confetti Creepers",
		compatibility: ["1.15"],
		description: `
			There is a chance each creeper will explode into confetti and do no damage to blocks.<br>
			<span class="more">
				Enter "/trigger conCre" for details.<br>
				Enter "/function confetti_creepers:config" to configure that chance.
			</span>
		`,
		tags: ["confetti", "creepers", "creeper", "explode", "explosion", "explosions", "mobgriefing", "mob", "griefing", "disable"],
		video: "iREMnbsZuTg"
	},
	mc: {
		dev: false,
		header: "",
		internalScoreboard: "conCre.dummy",
		rootNamespace: null
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
