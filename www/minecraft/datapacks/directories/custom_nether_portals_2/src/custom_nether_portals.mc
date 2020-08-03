function load {
	scoreboard objectives add cusNetPor trigger "Custom Nether Portals"
	scoreboard objectives add cusNetPor.config dummy "Custom Nether Portals Config"
	scoreboard objectives add cusNetPor.dummy dummy
	execute unless score #nonRectangular cusNetPor.config matches 0..1 run scoreboard players set #nonRectangular cusNetPor.config 1
	execute unless score #cryingObsidian cusNetPor.config matches 0..1 run scoreboard players set #cryingObsidian cusNetPor.config 1
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
}
function use_ignition {
	advancement revoke @s only custom_nether_portals:use_ignition
	scoreboard players set #ignited cusNetPor.dummy 0
	scoreboard players set #steps cusNetPor.dummy 50
	execute anchored eyes positioned ^ ^ ^ run {
		name raycast
		scoreboard players remove #steps cusNetPor.dummy 1
		execute if score #ignited cusNetPor.dummy matches 0 if block ~ ~ ~ minecraft:fire unless block ^ ^ ^0.1 #custom_nether_portals:air align xyz run {
			name ignite
			scoreboard players set #ignited cusNetPor.dummy 1
			scoreboard players set #success cusNetPor.dummy 0
			scoreboard players set #size cusNetPor.dummy 0
			block {
				name try_to_iterate_x
				execute unless predicate custom_nether_portals:valid run scoreboard players set #success cusNetPor.dummy -1
				execute if score #success cusNetPor.dummy matches 0 run {
					name iterate_x
					summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["cusNetPor.marker"]}
					execute if score #cryingObsidian cusNetPor.config matches 0 if block ~ ~ ~ minecraft:crying_obsidian run scoreboard players set #success cusNetPor.dummy -1
					execute if block ~ ~ ~ #custom_nether_portals:obsidian run scoreboard players add #size cusNetPor.dummy 1
					execute if score #size cusNetPor.dummy > #maxSize cusNetPor.config run scoreboard players set #success cusNetPor.dummy -1
					execute if score #success cusNetPor.dummy matches 0 unless block ~ ~ ~ #custom_nether_portals:obsidian run {
						name continue_x
						execute unless block ~ ~ ~ #custom_nether_portals:air run scoreboard players set #success cusNetPor.dummy -1
						execute if score #success cusNetPor.dummy matches 0 run {
							name check_x
							execute if score #success cusNetPor.dummy matches 0 positioned ~ ~-1 ~ unless entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run function custom_nether_portals:try_to_iterate_x
							execute if score #success cusNetPor.dummy matches 0 positioned ~-1 ~ ~ unless entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run function custom_nether_portals:try_to_iterate_x
							execute if score #success cusNetPor.dummy matches 0 positioned ~1 ~ ~ unless entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run function custom_nether_portals:try_to_iterate_x
							execute if score #success cusNetPor.dummy matches 0 positioned ~ ~1 ~ unless entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run function custom_nether_portals:try_to_iterate_x
						}
					}
				}
			}
			execute if score #size cusNetPor.dummy < #minSize cusNetPor.config run scoreboard players set #success cusNetPor.dummy -1
			execute unless score #nonRectangular cusNetPor.config matches 1 if score #success cusNetPor.dummy matches 0 at @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker] if block ~ ~ ~ #custom_nether_portals:obsidian run {
				name check_x_diagonal
				execute positioned ~ ~-1 ~ if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] positioned ~ ~1 ~ run function custom_nether_portals:check_x_sides
				execute if score #success cusNetPor.dummy matches 0 positioned ~ ~1 ~ if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] positioned ~ ~-1 ~ run function custom_nether_portals:check_x_sides
			}
			execute if score #success cusNetPor.dummy matches 0 run {
				name create_portal_x
				execute at @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker] if block ~ ~ ~ #custom_nether_portals:air run setblock ~ ~ ~ minecraft:nether_portal[axis=x]
				scoreboard players set #success cusNetPor.dummy 1
			}
			kill @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker]
			execute unless score #success cusNetPor.dummy matches 1 run {
				name try_z
				scoreboard players set #success cusNetPor.dummy 0
				scoreboard players set #size cusNetPor.dummy 0
				block {
					name try_to_iterate_z
					execute unless predicate custom_nether_portals:valid run scoreboard players set #success cusNetPor.dummy -1
					execute if score #success cusNetPor.dummy matches 0 run {
						name iterate_z
						summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["cusNetPor.marker"]}
						execute if score #cryingObsidian cusNetPor.config matches 0 if block ~ ~ ~ minecraft:crying_obsidian run scoreboard players set #success cusNetPor.dummy -1
						execute if block ~ ~ ~ #custom_nether_portals:obsidian run scoreboard players add #size cusNetPor.dummy 1
						execute if score #size cusNetPor.dummy > #maxSize cusNetPor.config run scoreboard players set #success cusNetPor.dummy -1
						execute if score #success cusNetPor.dummy matches 0 unless block ~ ~ ~ #custom_nether_portals:obsidian run {
							name continue_z
							execute unless block ~ ~ ~ #custom_nether_portals:air run scoreboard players set #success cusNetPor.dummy -1
							execute if score #success cusNetPor.dummy matches 0 run {
								name check_z
								execute if score #success cusNetPor.dummy matches 0 positioned ~ ~-1 ~ unless entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run function custom_nether_portals:try_to_iterate_z
								execute if score #success cusNetPor.dummy matches 0 positioned ~ ~ ~-1 unless entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run function custom_nether_portals:try_to_iterate_z
								execute if score #success cusNetPor.dummy matches 0 positioned ~ ~ ~1 unless entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run function custom_nether_portals:try_to_iterate_z
								execute if score #success cusNetPor.dummy matches 0 positioned ~ ~1 ~ unless entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run function custom_nether_portals:try_to_iterate_z
							}
						}
					}
				}
				execute if score #size cusNetPor.dummy < #minSize cusNetPor.config run scoreboard players set #success cusNetPor.dummy -1
				execute unless score #nonRectangular cusNetPor.config matches 1 if score #success cusNetPor.dummy matches 0 as @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker] at @s if block ~ ~ ~ #custom_nether_portals:obsidian run {
					name check_z_diagonal
					execute positioned ~ ~-1 ~ if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] positioned ~ ~1 ~ run function custom_nether_portals:check_z_sides
					execute if score #success cusNetPor.dummy matches 0 positioned ~ ~1 ~ if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] positioned ~ ~-1 ~ run function custom_nether_portals:check_z_sides
				}
				execute if score #success cusNetPor.dummy matches 0 at @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker] if block ~ ~ ~ #custom_nether_portals:air run setblock ~ ~ ~ minecraft:nether_portal[axis=z]
				kill @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker]
			}
		}
		execute unless score #ignited cusNetPor.dummy matches 0 unless block ~ ~ ~ minecraft:fire run scoreboard players set #ignited cusNetPor.dummy 0
		execute unless score #steps cusNetPor.dummy matches 0 positioned ^ ^ ^0.1 run function $block
	}
}
function check_x_sides {
	execute positioned ~-1 ~ ~ if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run scoreboard players set #success cusNetPor.dummy -1
	execute positioned ~1 ~ ~ if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run scoreboard players set #success cusNetPor.dummy -1
}
function check_z_sides {
	execute positioned ~ ~ ~-1 if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run scoreboard players set #success cusNetPor.dummy -1
	execute positioned ~ ~ ~1 if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] run scoreboard players set #success cusNetPor.dummy -1
}
function info {
	tellraw @s [{"text":"Nether portal frames must use at least ","color":"dark_aqua"},{"score":{"name":"#minSize","objective":"cusNetPor.config"},"color":"aqua"},{"text":" and at most ","color":"dark_aqua"},{"score":{"name":"#maxSize","objective":"cusNetPor.config"},"color":"aqua"},{"text":" obsidian blocks.","color":"dark_aqua"}]
	scoreboard players set @s cusNetPor 0
}
function config {
	function custom_nether_portals:info
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/scoreboard players set #nonRectangular cusNetPor.config <0 or 1>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #nonRectangular cusNetPor.config "},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/scoreboard players set #nonRectangular cusNetPor.config","color":"aqua"},{"text":".\nEnter 0 or 1 after clicking.","color":"dark_aqua"}]}},{"text":" to (0) disallow or (1) allow non-rectangular nether portal frames. The default is ","color":"dark_aqua"},{"text":"1","color":"aqua","clickEvent":{"action":"run_command","value":"/scoreboard players set #nonRectangular cusNetPor.config 1"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/scoreboard players set #nonRectangular cusNetPor.config 1","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":". The current value is ","color":"dark_aqua"},{"score":{"name":"#nonRectangular","objective":"cusNetPor.config"},"color":"aqua"},{"text":".","color":"dark_aqua"}]
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/scoreboard players set #cryingObsidian cusNetPor.config <0 or 1>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #cryingObsidian cusNetPor.config "},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/scoreboard players set #cryingObsidian cusNetPor.config","color":"aqua"},{"text":".\nEnter 0 or 1 after clicking.","color":"dark_aqua"}]}},{"text":" to (0) disallow or (1) allow crying obsidian in nether portal frames. The default is ","color":"dark_aqua"},{"text":"1","color":"aqua","clickEvent":{"action":"run_command","value":"/scoreboard players set #cryingObsidian cusNetPor.config 1"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/scoreboard players set #cryingObsidian cusNetPor.config 1","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":". The current value is ","color":"dark_aqua"},{"score":{"name":"#cryingObsidian","objective":"cusNetPor.config"},"color":"aqua"},{"text":".","color":"dark_aqua"}]
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/scoreboard players set #minSize cusNetPor.config <number>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #minSize cusNetPor.config "},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/scoreboard players set #minSize cusNetPor.config","color":"aqua"},{"text":".\nEnter the number 10 or less after clicking.","color":"dark_aqua"}]}},{"text":" to set the minimum number of obsidian blocks a nether portal must use. The default is ","color":"dark_aqua"},{"text":"10","color":"aqua","clickEvent":{"action":"run_command","value":"/scoreboard players set #minSize cusNetPor.config 10"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/scoreboard players set #minSize cusNetPor.config 10","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":".","color":"dark_aqua"}]
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/scoreboard players set #maxSize cusNetPor.config <number>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #maxSize cusNetPor.config "},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/scoreboard players set #maxSize cusNetPor.config","color":"aqua"},{"text":".\nEnter the number 84 or more after clicking.","color":"dark_aqua"}]}},{"text":" to set the maximum number of obsidian blocks a nether portal must use. The default is ","color":"dark_aqua"},{"text":"84","color":"aqua","clickEvent":{"action":"run_command","value":"/scoreboard players set #maxSize cusNetPor.config 84"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/scoreboard players set #maxSize cusNetPor.config 84","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":". ","color":"dark_aqua"},{"text":"Warning: Increasing the maximum may lead to large portals not being broken properly.","color":"red"}]
}
