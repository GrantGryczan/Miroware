function load {
	LOOP (this.data.criteria.length, i) {
		scoreboard objectives add lecStat.<%this.i%> <%this.data.criteria[this.i]%>
	}
}
function uninstall {
	schedule clear lectern_stats:update_stats
	LOOP (this.data.criteria.length, i) {
		scoreboard objectives remove lecStat.<%this.i%>
	}
}
clock 300s {
	name update_stats
	
}
