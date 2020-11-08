function load {
	scoreboard objectives add craXPBot.dummy dummy
	advancement revoke @a only xp_management:try_to_bottle_xp
}
function uninstall {
	scoreboard objectives remove craXPBot.dummy
}
function try_to_bottle_xp {
	advancement revoke @s only xp_management:try_to_bottle_xp
	tag @s add craXPBot.continue
	execute store result score #points craXPBot.dummy run xp query @s points
	execute if score #points craXPBot.dummy matches ..4 if entity @s[level=1] run tag @s remove craXPBot.continue
	execute if entity @s[tag=craXPBot.continue] run {
		name bottle_xp
		clear @s minecraft:glass_bottle 1
		give @s minecraft:experience_bottle
		xp add @s -12 points
		playsound minecraft:item.bottle.fill_dragonbreath player @a ~ ~ ~ 1 1.25
		scoreboard players set #steps craXPBot.dummy 50
		execute anchored eyes positioned ^ ^ ^ run {
			name raycast
			scoreboard players remove #steps craXPBot.dummy 1
			execute if block ~ ~ ~ minecraft:enchanting_table run {
				name check_enchanting_table
				summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["craXPBot.marker"]}
				execute align y if entity @e[type=minecraft:area_effect_cloud,tag=craXPBot.marker,distance=..0.75] run {
					name replace_enchanting_table
					summon minecraft:item_frame ~ ~1000 ~ {Tags:["craXPBot.enchTable","craXPBot.new"],Fixed:1b,Invisible:1b,Item:{id:"minecraft:enchanting_table",Count:1b,tag:{craXPBotData:{}}}}
					data modify entity @e[type=minecraft:item_frame,tag=craXPBot.new,limit=1] Item.tag.craXPBotData set from block ~ ~ ~ {}
					setblock ~ ~ ~ minecraft:snow[layers=6]
					scoreboard players set #steps craXPBot.dummy 0
					schedule 2t append {
						name restore_enchanting_tables
						execute as @e[type=minecraft:item_frame,tag=craXPBot.enchTable] at @s positioned ~ ~-1000 ~ run {
							name restore_enchanting_table
							setblock ~ ~ ~ minecraft:enchanting_table
							data modify block ~ ~ ~ {} set from entity @s Item.tag.craXPBotData
							kill @s
						}
					}
				}
				kill @e[type=minecraft:area_effect_cloud,tag=craXPBot.marker]
			}
			execute unless score #steps craXPBot.dummy matches 0 positioned ^ ^ ^0.1 run function $block
		}
		tag @s remove craXPBot.continue
	}
}
