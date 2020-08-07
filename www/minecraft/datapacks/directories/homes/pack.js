module.exports = {
	namespace: "homes",
	version: "1.3.4",
	name: "Homes",
	compatibility: ["1.16"],
	description: `
		Enter "/trigger sethome" or "/trigger sethome set &lt;ID&gt;" to set a home.<br>
		Enter "/trigger home" or "/trigger home set &lt;ID&gt;" to teleport there at any time.<br>
		<span class="more">
			Enter "/trigger homes" to list your homes.<br>
			Enter "/trigger namehome" or "/trigger namehome set &lt;ID&gt;" to name a home.<br>
			Enter "/trigger delhome" or "/trigger delhome set &lt;ID&gt;" to delete a home.<br>
			Enter "/function homes:config" to configure the maximum number of homes allowed per player or the time players must stand still before teleporting after running the home command.
		</span>
	`,
	tags: []
};
