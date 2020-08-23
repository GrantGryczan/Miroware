function load {
	scoreboard objectives add cusNetPor trigger "Custom Nether Portals"
	scoreboard objectives add cusNetPor.config dummy "Custom Nether Portals Config"
	scoreboard objectives add cusNetPor.dummy dummy
	scoreboard objectives add cusNetPor.useFAS minecraft.used:minecraft.flint_and_steel
	scoreboard objectives add cusNetPor.useFC minecraft.used:minecraft.fire_charge
	execute unless score #nonRectangular cusNetPor.config matches 0..1 run scoreboard players set #nonRectangular cusNetPor.config 1
	execute unless score #minSize cusNetPor.config matches 0.. run scoreboard players set #minSize cusNetPor.config 10
	execute unless score #maxSize cusNetPor.config matches 0.. run scoreboard players set #maxSize cusNetPor.config 84
	scoreboard players reset * cusNetPor.useFAS
	scoreboard players reset * cusNetPor.useFC
}
function uninstall {
	scoreboard objectives remove cusNetPor
	scoreboard objectives remove cusNetPor.config
	scoreboard objectives remove cusNetPor.dummy
	schedule clear custom_nether_portals:tick
	schedule clear custom_nether_portals:try_to_trigger
	schedule clear custom_nether_portals:enable_trigger
}
clock 1t {
	name tick
	execute as @a[predicate=custom_nether_portals:used_ignition] at @s run function custom_nether_portals:use_ignition
}
clock 5t {
	name try_to_trigger
	execute as @a[scores={cusNetPor=1}] run {
		name trigger
		tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
		tellraw @s ["                     Custom Nether Portals",{"text":" / ","color":"gray"},"Info                     "]
		tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
		tellraw @s ["",{"text":">> ","color":"gray"},"Nether portal frames must use at least ",{"score":{"name":"#minSize","objective":"cusNetPor.config"}}," and at most ",{"score":{"name":"#maxSize","objective":"cusNetPor.config"}}," obsidian blocks."]
		execute if score #nonRectangular cusNetPor.config matches 1 run tellraw @s ["",{"text":">> ","color":"gray"},"Nether portal frames ",{"text":"can","color":"green"}," have non-rectangular shapes."]
		execute unless score #nonRectangular cusNetPor.config matches 1 run tellraw @s ["",{"text":">> ","color":"gray"},"Nether portal frames ",{"text":"cannot","color":"red"}," have non-rectangular shapes."]
		tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
		scoreboard players set @s cusNetPor 0
		scoreboard players enable @s cusNetPor
	}
}
clock 1s {
	name enable_trigger
	scoreboard players enable @a cusNetPor
}
function use_ignition {
	scoreboard players set @s cusNetPor.useFAS 0
	scoreboard players set @s cusNetPor.useFC 0
	execute if predicate custom_nether_portals:overworld_or_nether run {
		name start_to_raycast
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
						execute if block ~ ~ ~ minecraft:obsidian run scoreboard players add #size cusNetPor.dummy 1
						execute if score #size cusNetPor.dummy > #maxSize cusNetPor.config run scoreboard players set #success cusNetPor.dummy -1
						execute if score #success cusNetPor.dummy matches 0 unless block ~ ~ ~ minecraft:obsidian run {
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
				execute unless score #nonRectangular cusNetPor.config matches 1 if score #success cusNetPor.dummy matches 0 at @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker] if block ~ ~ ~ minecraft:obsidian run {
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
							execute if block ~ ~ ~ minecraft:obsidian run scoreboard players add #size cusNetPor.dummy 1
							execute if score #size cusNetPor.dummy > #maxSize cusNetPor.config run scoreboard players set #success cusNetPor.dummy -1
							execute if score #success cusNetPor.dummy matches 0 unless block ~ ~ ~ minecraft:obsidian run {
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
					execute unless score #nonRectangular cusNetPor.config matches 1 if score #success cusNetPor.dummy matches 0 as @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker] at @s if block ~ ~ ~ minecraft:obsidian run {
						name check_z_diagonal
						execute positioned ~ ~-1 ~ if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] positioned ~ ~1 ~ run function custom_nether_portals:check_z_sides
						execute if score #success cusNetPor.dummy matches 0 positioned ~ ~1 ~ if block ~ ~ ~ #custom_nether_portals:air if entity @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker,distance=..0.1] positioned ~ ~-1 ~ run function custom_nether_portals:check_z_sides
					}
					execute if score #success cusNetPor.dummy matches 0 at @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker] if block ~ ~ ~ #custom_nether_portals:air run setblock ~ ~ ~ minecraft:nether_portal[axis=z]
					kill @e[type=minecraft:area_effect_cloud,tag=cusNetPor.marker]
				}
			}
			execute unless score #ignited cusNetPor.dummy matches 0 unless block ~ ~ ~ minecraft:fire run scoreboard players set #ignited cusNetPor.dummy 0
			execute unless score #steps cusNetPor.dummy matches 0 positioned ^ ^ ^0.1 run function custom_nether_portals:raycast
		}
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
function config {
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	tellraw @s ["               Custom Nether Portals",{"text":" / ","color":"gray"},"Global Settings               "]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	execute if score #nonRectangular cusNetPor.config matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function custom_nether_portals:config/disable_non_rectangular"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Non-Rectangular Frames",{"text":".","color":"red"},{"text":"\nWhen enabled, nether portal frames can have non-rectangular shapes.","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," Non-Rectangular Frames"]
	execute unless score #nonRectangular cusNetPor.config matches 1 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function custom_nether_portals:config/enable_non_rectangular"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Non-Rectangular Frames",{"text":".","color":"green"},{"text":"\nWhen enabled, nether portal frames can have non-rectangular shapes.","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," Non-Rectangular Frames"]
	tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #minSize cusNetPor.config "},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enter the minimum number of obsidian blocks a nether portal frame can have.","color":"gray"},{"text":"\nAccepts: whole numbers 4-10\nDefault: 10","color":"dark_gray"}]}}," Min Frame Size ",{"text":"(Current: ","color":"gray"},{"score":{"name":"#minSize","objective":"cusNetPor.config"},"color":"gray"},{"text":")","color":"gray"}]
	tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #maxSize cusNetPor.config "},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enter the maximum number of obsidian blocks a nether portal frame can have.","color":"gray"},{"text":"\nIncreasing this may lead to large portals not being broken properly.","color":"red"},{"text":"\nAccepts: whole numbers 84+\nDefault: 84","color":"dark_gray"}]}}," Max Frame Size ",{"text":"(Current: ","color":"gray"},{"score":{"name":"#maxSize","objective":"cusNetPor.config"},"color":"gray"},{"text":")","color":"gray"}]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	execute store result score #sendCommandFeedback cusNetPor.config run gamerule sendCommandFeedback
	execute if score #sendCommandFeedback cusNetPor.config matches 1 run {
		name hide_command_feedback
		gamerule sendCommandFeedback false
		schedule 1t replace {
			name restore_command_feedback
			gamerule sendCommandFeedback true
		}
	}
}
dir config {
	function enable_non_rectangular {
		scoreboard players set #nonRectangular cusNetPor.config 1
		function custom_nether_portals:config
	}
	function disable_non_rectangular {
		scoreboard players set #nonRectangular cusNetPor.config 0
		function custom_nether_portals:config
	}
}
