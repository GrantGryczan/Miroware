module.exports = {
	namespace: "back",
	version: "1.1.0",
	name: "Back",
	compatibility: ["1.16"],
	description: `
		Enter "/trigger back" to go back to the last location you teleported from (using Homes, Spawn, TPA, or Back), or to your last death location if that's enabled.<br>
		<span class="more">
			Enter "/function back:config" to configure the time players must stand still before teleporting after running the back command or whether to save death locations in the back command.
		</span>
	`,
	tags: []
};
