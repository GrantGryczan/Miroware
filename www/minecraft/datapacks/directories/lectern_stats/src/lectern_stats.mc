function load {
	LOOP (config.data.criteria.length, i) {
		scoreboard objectives add lecStat.<% i %> <% config.data.criteria[i] %>
	}
}
function uninstall {
	schedule clear lectern_stats:update_stats
	LOOP (config.data.criteria.length, i) {
		scoreboard objectives remove lecStat.<% i %>
	}
}
clock 300s {
	name update_stats
	
}
