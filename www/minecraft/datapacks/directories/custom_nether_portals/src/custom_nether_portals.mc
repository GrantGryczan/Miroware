function load {
	scoreboard objectives add cusNetPor trigger "Custom Nether Portals"
	scoreboard objectives add cusNetPor.config dummy "Custom Nether Portals Config"
	scoreboard objectives add cusNetPor.dummy dummy
	scoreboard objectives add cusNetPor.useFAS minecraft.used:minecraft.flint_and_steel
	scoreboard objectives add cusNetPor.useFC minecraft.used:minecraft.fire_charge
	execute unless score #nonRectangular cusNetPor.config matches 0..1 run scoreboard players set #nonRectangular cusNetPor.config 1
	execute unless score #minSize cusNetPor.config matches 0.. run scoreboard players set #minSize cusNetPor.config 10
	execute unless score #maxSize cusNetPor.config matches 0.. run scoreboard players set #maxSize cusNetPor.config 84
}
function uninstall {
	scoreboard objectives remove cusNetPor
	scoreboard objectives remove cusNetPor.config
	scoreboard objectives remove cusNetPor.dummy
	schedule clear custom_nether_portals:tick
}
clock 1t {
	name tick
	scoreboard players enable @a cusNetPor
	execute as @a[scores={cusNetPor=1}] run function custom_nether_portals:info
	scoreboard players set @a cusNetPor 0
	execute as @a[scores={cusNetPor.useFAS=1..}] at @s run function custom_nether_portals:use_ignition
	execute as @a[scores={cusNetPor.useFC=1..}] at @s run function custom_nether_portals:use_ignition
}
function use_ignition {
	scoreboard players set @s cusNetPor.useFAS 0
	scoreboard players set @s cusNetPor.useFC 0
	execute if predicate custom_nether_portals:overworld_or_nether run function custom_nether_portals:start_to_raycast
}
function try_z {
	scoreboard players set #success cusNetPor.dummy 0
	scoreboard players set #size cusNetPor.dummy 0
	function custom_nether_portals:iterate_z
	execute if score #size cusNetPor.dummy < #minSize cusNetPor.config run scoreboard players set #success cusNetPor.dummy -1
	execute unless score #nonRectangular cusNetPor.config matches 1 if score #success cusNetPor.dummy matches 0 as @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker] at @s if block ~ ~ ~ minecraft:obsidian run function custom_nether_portals:check_z_diagonal
	execute if score #success cusNetPor.dummy matches 0 at @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker] if block ~ ~ ~ #custom_nether_portals:air run setblock ~ ~ ~ minecraft:nether_portal[axis=z]
	kill @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker]
}
function try_to_iterate_z {
	execute unless predicate custom_nether_portals:valid run scoreboard players set #success cusNetPor.dummy -1
	execute if score #success cusNetPor.dummy matches 0 run function custom_nether_portals:iterate_z
}
function try_to_iterate_x {
	execute unless predicate custom_nether_portals:valid run scoreboard players set #success cusNetPor.dummy -1
	execute if score #success cusNetPor.dummy matches 0 run function custom_nether_portals:iterate_x
}
function start_to_raycast {
	scoreboard players set #ignited cusNetPor.dummy 0
	scoreboard players set #steps cusNetPor.dummy 50
	execute anchored eyes run function custom_nether_portals:raycast
}
function raycast {
	scoreboard players remove #steps cusNetPor.dummy 1
	execute if score #ignited cusNetPor.dummy matches 0 if block ~ ~ ~ minecraft:fire unless block ^ ^ ^0.1 #custom_nether_portals:air align xyz run function custom_nether_portals:ignite
	execute unless score #ignited cusNetPor.dummy matches 0 unless block ~ ~ ~ minecraft:fire run scoreboard players set #ignited cusNetPor.dummy 0
	execute unless score #steps cusNetPor.dummy matches 0 positioned ^ ^ ^0.1 run function custom_nether_portals:raycast
}
function iterate_z {
	summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["cusNetPor.marker"]}
	execute if block ~ ~ ~ minecraft:obsidian run scoreboard players add #size cusNetPor.dummy 1
	execute if score #size cusNetPor.dummy > #maxSize cusNetPor.config run scoreboard players set #success cusNetPor.dummy -1
	execute if score #success cusNetPor.dummy matches 0 unless block ~ ~ ~ minecraft:obsidian run function custom_nether_portals:continue_z
}
function iterate_x {
	summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["cusNetPor.marker"]}
	execute if block ~ ~ ~ minecraft:obsidian run scoreboard players add #size cusNetPor.dummy 1
	execute if score #size cusNetPor.dummy > #maxSize cusNetPor.config run scoreboard players set #success cusNetPor.dummy -1
	execute if score #success cusNetPor.dummy matches 0 unless block ~ ~ ~ minecraft:obsidian run function custom_nether_portals:continue_x
}
function info {
	tellraw @s [{"text":"Nether portal frames must use at least ","color":"dark_aqua"},{"score":{"name":"#minSize","objective":"cusNetPor.config"},"color":"aqua"},{"text":" and at most ","color":"dark_aqua"},{"score":{"name":"#maxSize","objective":"cusNetPor.config"},"color":"aqua"},{"text":" obsidian blocks.","color":"dark_aqua"}]
}
function ignite {
	scoreboard players set #ignited cusNetPor.dummy 1
	scoreboard players set #success cusNetPor.dummy 0
	scoreboard players set #size cusNetPor.dummy 0
	function custom_nether_portals:try_to_iterate_x
	execute if score #size cusNetPor.dummy < #minSize cusNetPor.config run scoreboard players set #success cusNetPor.dummy -1
	execute unless score #nonRectangular cusNetPor.config matches 1 if score #success cusNetPor.dummy matches 0 at @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker] if block ~ ~ ~ minecraft:obsidian run function custom_nether_portals:check_x_diagonal
	execute if score #success cusNetPor.dummy matches 0 run function custom_nether_portals:create_portal_x
	kill @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker]
	execute unless score #success cusNetPor.dummy matches 1 run function custom_nether_portals:try_z
}
function create_portal_x {
	execute at @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker] if block ~ ~ ~ #custom_nether_portals:air run setblock ~ ~ ~ minecraft:nether_portal[axis=x]
	scoreboard players set #success cusNetPor.dummy 1
}
function continue_z {
	execute unless block ~ ~ ~ #custom_nether_portals:air run scoreboard players set #success cusNetPor.dummy -1
	execute if score #success cusNetPor.dummy matches 0 run function custom_nether_portals:check_z
}
function continue_x {
	execute unless block ~ ~ ~ #custom_nether_portals:air run scoreboard players set #success cusNetPor.dummy -1
	execute if score #success cusNetPor.dummy matches 0 run function custom_nether_portals:check_x
}
function config {
	function custom_nether_portals:info
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/scoreboard players set #nonRectangular cusNetPor.config <0 or 1>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #nonRectangular cusNetPor.config "},"hoverEvent":{"action":"show_text","value":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/scoreboard players set #nonRectangular cusNetPor.config","color":"aqua"},{"text":".\nEnter 0 or 1 after clicking.","color":"dark_aqua"}]}},{"text":" to (0) disallow or (1) allow non-rectangular nether portal frames. The default is ","color":"dark_aqua"},{"text":"1","color":"aqua","clickEvent":{"action":"run_command","value":"/scoreboard players set #nonRectangular cusNetPor.config 1"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/scoreboard players set #nonRectangular cusNetPor.config 1","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":". The current value is ","color":"dark_aqua"},{"score":{"name":"#nonRectangular","objective":"cusNetPor.config"},"color":"aqua"},{"text":".","color":"dark_aqua"}]
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/scoreboard players set #minSize cusNetPor.config <number>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #minSize cusNetPor.config "},"hoverEvent":{"action":"show_text","value":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/scoreboard players set #minSize cusNetPor.config","color":"aqua"},{"text":".\nEnter the number 10 or less after clicking.","color":"dark_aqua"}]}},{"text":" to set the minimum number of obsidian blocks a nether portal must use. The default is ","color":"dark_aqua"},{"text":"10","color":"aqua","clickEvent":{"action":"run_command","value":"/scoreboard players set #minSize cusNetPor.config 10"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/scoreboard players set #minSize cusNetPor.config 10","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":".","color":"dark_aqua"}]
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/scoreboard players set #maxSize cusNetPor.config <number>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #maxSize cusNetPor.config "},"hoverEvent":{"action":"show_text","value":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/scoreboard players set #maxSize cusNetPor.config","color":"aqua"},{"text":".\nEnter the number 84 or more after clicking.","color":"dark_aqua"}]}},{"text":" to set the maximum number of obsidian blocks a nether portal must use. The default is ","color":"dark_aqua"},{"text":"84","color":"aqua","clickEvent":{"action":"run_command","value":"/scoreboard players set #maxSize cusNetPor.config 84"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/scoreboard players set #maxSize cusNetPor.config 84","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":". ","color":"dark_aqua"},{"text":"Warning: Increasing the maximum may lead to large portals not being broken properly.","color":"red"}]
}
function check_z_sides {
	execute positioned ~ ~ ~-1 if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run scoreboard players set #success cusNetPor.dummy -1
	execute positioned ~ ~ ~1 if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run scoreboard players set #success cusNetPor.dummy -1
}
function check_z_diagonal {
	execute positioned ~ ~-1 ~ if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] positioned ~ ~1 ~ run function custom_nether_portals:check_z_sides
	execute if score #success cusNetPor.dummy matches 0 positioned ~ ~1 ~ if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] positioned ~ ~-1 ~ run function custom_nether_portals:check_z_sides
}
function check_z {
	execute if score #success cusNetPor.dummy matches 0 positioned ~ ~-1 ~ unless entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run function custom_nether_portals:try_to_iterate_z
	execute if score #success cusNetPor.dummy matches 0 positioned ~ ~ ~-1 unless entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run function custom_nether_portals:try_to_iterate_z
	execute if score #success cusNetPor.dummy matches 0 positioned ~ ~ ~1 unless entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run function custom_nether_portals:try_to_iterate_z
	execute if score #success cusNetPor.dummy matches 0 positioned ~ ~1 ~ unless entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run function custom_nether_portals:try_to_iterate_z
}
function check_x_sides {
	execute positioned ~-1 ~ ~ if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run scoreboard players set #success cusNetPor.dummy -1
	execute positioned ~1 ~ ~ if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run scoreboard players set #success cusNetPor.dummy -1
}
function check_x_diagonal {
	execute positioned ~ ~-1 ~ if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] positioned ~ ~1 ~ run function custom_nether_portals:check_x_sides
	execute if score #success cusNetPor.dummy matches 0 positioned ~ ~1 ~ if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] positioned ~ ~-1 ~ run function custom_nether_portals:check_x_sides
}
function check_x {
	execute if score #success cusNetPor.dummy matches 0 positioned ~ ~-1 ~ unless entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run function custom_nether_portals:try_to_iterate_x
	execute if score #success cusNetPor.dummy matches 0 positioned ~-1 ~ ~ unless entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run function custom_nether_portals:try_to_iterate_x
	execute if score #success cusNetPor.dummy matches 0 positioned ~1 ~ ~ unless entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run function custom_nether_portals:try_to_iterate_x
	execute if score #success cusNetPor.dummy matches 0 positioned ~ ~1 ~ unless entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run function custom_nether_portals:try_to_iterate_x
}
