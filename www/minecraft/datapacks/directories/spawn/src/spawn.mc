function load {
	scoreboard objectives add spawn trigger "Spawn"
	scoreboard objectives add spawn.config dummy "Spawn Config"
	scoreboard objectives add spawn.dummy dummy
	scoreboard objectives add spawn.timer dummy
	scoreboard objectives add spawn.x dummy
	scoreboard objectives add spawn.y dummy
	scoreboard objectives add spawn.z dummy
	execute unless score #delay spawn.config matches 0.. run scoreboard players set #delay spawn.config 0
}
function uninstall {
	scoreboard objectives remove spawn
	scoreboard objectives remove spawn.config
	scoreboard objectives remove spawn.dummy
	scoreboard objectives remove spawn.timer
	scoreboard objectives remove spawn.x
	scoreboard objectives remove spawn.y
	scoreboard objectives remove spawn.z
	schedule clear spawn:tick
}
clock 1t {
	name tick
	scoreboard players enable @a spawn
	execute as @a[scores={spawn=1..}] run function spawn:trigger_spawn
	execute as @a[scores={spawn.timer=0..}] align xz positioned ~0.5 ~ ~0.5 run function spawn:try_to_try_to_go_to_spawn
}
function try_to_try_to_go_to_spawn {
	execute if score @s spawn.timer matches 0 run function spawn:try_to_go_to_spawn
	execute unless score @s spawn.timer matches 0 run scoreboard players remove @s spawn.timer 1
}
function try_to_go_to_spawn {
	scoreboard players set #success spawn.dummy 0
	execute store result score #value spawn.dummy run data get entity @s Pos[1] 10
	execute if score #value spawn.dummy = @s spawn.y run function spawn:check_x
	execute if score #success spawn.dummy matches 0 run tellraw @s [{"text":"You must stand still to teleport.","color":"red"}]
	execute unless score #success spawn.dummy matches 0 run function spawn:go_to_spawn
	scoreboard players reset @s spawn.timer
}
function trigger_spawn {
	tellraw @s {"text":"Teleporting to world spawn...","color":"dark_aqua"}
	scoreboard players operation @s spawn.timer = #delay spawn.config
	execute store result score @s spawn.x run data get entity @s Pos[0] 10
	execute store result score @s spawn.y run data get entity @s Pos[1] 10
	execute store result score @s spawn.z run data get entity @s Pos[2] 10
	scoreboard players set @s spawn 0
}
function offset_up {
	tp ~ ~ ~
	execute unless block ~ ~ ~ minecraft:air if entity @s[y=0,dy=255] positioned ~ ~1 ~ run function spawn:offset_up
}
function offset_down {
	tp ~ ~ ~
	execute positioned ~ ~-1 ~ if block ~ ~ ~ minecraft:air run function spawn:offset_down
	execute if entity @s[y=0,dy=0] at 3a5b963b-ece2-4ac1-933d-17fce73777be run tp ~ ~ ~
}
function go_to_spawn {
	summon minecraft:area_effect_cloud ~ ~ ~ {UUIDMost:4205119861201980097L,UUIDLeast:-7837081401576425538L}
	function spawn:offset_up
	execute if block ~ ~ ~ minecraft:air run function spawn:offset_down
	kill 3a5b963b-ece2-4ac1-933d-17fce73777be
}
function config {
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/scoreboard players set #delay spawn.config <number>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #delay spawn.config "},"hoverEvent":{"action":"show_text","value":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/scoreboard players set #delay spawn.config","color":"aqua"},{"text":".\nEnter the number after clicking.","color":"dark_aqua"}]}},{"text":" to set the number of ticks to delay teleportation after running the spawn command. (1 second = 20 ticks.) The default is ","color":"dark_aqua"},{"text":"0","color":"aqua","clickEvent":{"action":"run_command","value":"/scoreboard players set #delay spawn.config 0"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/scoreboard players set #delay spawn.config 0","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":". The current value is ","color":"dark_aqua"},{"score":{"name":"#delay","objective":"spawn.config"},"color":"aqua"},{"text":".","color":"dark_aqua"}]
}
function check_z {
	execute store result score #value spawn.dummy run data get entity @s Pos[2] 10
	execute store success score #success spawn.dummy if score #value spawn.dummy = @s spawn.z
}
function check_x {
	execute store result score #value spawn.dummy run data get entity @s Pos[0] 10
	execute if score #value spawn.dummy = @s spawn.x run function spawn:check_z
}
