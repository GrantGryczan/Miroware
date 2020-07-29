module.exports = {
	namespace: "tpa",
	version: "2.2.0",
	name: "TPA",
	compatibility: ["1.16"],
	description: `
		Enter "/trigger tpa set &lt;PID&gt;" to request to teleport to another player.<br>
		Each player's PID (player ID) number can be found in the player list by pressing Tab by default.<br>
		<span class="more">
			Enter "/function tpa:config" to configure the time players must stand still before teleportation after their teleport request is accepted.
		</span><br>
		<b>Incompatible with Death Counter</b>
	`,
	tags: []
};
