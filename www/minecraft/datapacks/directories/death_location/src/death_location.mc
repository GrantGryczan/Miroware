function load {
	scoreboard objectives add deaLoc.dummy dummy
	scoreboard objectives add deaLoc.deaths deathCount
}
function uninstall {
	scoreboard objectives remove deaLoc.dummy
	scoreboard objectives remove deaLoc.deaths
	schedule clear death_location:tick
}
clock 1t {
	name tick
	execute as @a[scores={deaLoc.deaths=1..}] run {
		name death
		execute store result score #x deaLoc.dummy run data get entity @s Pos[0]
		execute store result score #y deaLoc.dummy run data get entity @s Pos[1]
		execute store result score #z deaLoc.dummy run data get entity @s Pos[2]
		tellraw @s [{"text":"Death location: ","color":"dark_aqua"},{"text":"(","color":"aqua"},{"score":{"name":"#x","objective":"deaLoc.dummy"},"color":"aqua"},{"text":", ","color":"aqua"},{"score":{"name":"#y","objective":"deaLoc.dummy"},"color":"aqua"},{"text":", ","color":"aqua"},{"score":{"name":"#z","objective":"deaLoc.dummy"},"color":"aqua"},{"text":")","color":"aqua"},{"text":" in ","color":"dark_aqua"},{"entity":"@s","nbt":"Dimension","color":"dark_aqua"}]
		scoreboard players reset @s deaLoc.deaths
	}
}
