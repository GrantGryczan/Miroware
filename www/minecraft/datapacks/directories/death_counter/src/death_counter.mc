function load {
	scoreboard objectives add deaCou.deaths deathCount "Deaths"
	scoreboard objectives setdisplay list deaCou.deaths
}
function uninstall {
	scoreboard objectives remove deaCou.deaths
}
