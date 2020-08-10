function load {
	scoreboard objectives add heaCou.health health "Health"
	scoreboard objectives setdisplay belowName heaCou.health
}
function uninstall {
	scoreboard objectives remove heaCou.health
}
