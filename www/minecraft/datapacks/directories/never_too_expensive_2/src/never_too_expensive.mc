function load {
	scoreboard objectives add nevTooExp.config dummy "Never Too Expensive Config"
	scoreboard objectives add nevTooExp trigger "Never Too Expensive"
	scoreboard objectives add nevTooExp.count dummy
	scoreboard objectives add nevTooExp.cost dummy
	execute unless score #bottles nevTooExp.config matches 1.. run scoreboard players set #bottles nevTooExp.config 1
	execute unless score #levels nevTooExp.config matches 1.. run scoreboard players set #levels nevTooExp.config 40
}
function uninstall {
	schedule clear never_too_expensive:tick
	scoreboard objectives remove nevTooExp
	scoreboard objectives remove nevTooExp.config
	scoreboard objectives remove nevTooExp.count
	scoreboard objectives remove nevTooExp.cost
}
clock 1t {
	name tick
	execute as @e[type=minecraft:item] at @s if block ~ ~ ~ minecraft:cauldron if data entity @s Item.tag.RepairCost if entity @s[nbt={Item:{Count:1b}}] store result score @s nevTooExp.cost run data get entity @s Item.tag.RepairCost
	execute as @e[type=minecraft:item,scores={nevTooExp.cost=1..}] at @s run {
		name tick_costly_item_in_cauldron
		tag @s add nevTooExp.subject
		execute align xyz run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,nbt={Item:{id:"minecraft:experience_bottle"}}] add nevTooExp.bottle
		execute as @e[type=minecraft:item,tag=nevTooExp.bottle] store result score @s nevTooExp.count run data get entity @s Item.Count
		execute as @e[type=minecraft:item,tag=nevTooExp.bottle] run scoreboard players operation @e[type=minecraft:item,tag=nevTooExp.subject] nevTooExp.count += @s nevTooExp.count
		execute if score @s nevTooExp.count >= #bottles nevTooExp.config run {
			name reduce_repair_cost
			tag @s[scores={nevTooExp.cost=40..}] add nevTooExp.levelDown
			scoreboard players operation @s nevTooExp.cost -= #levels nevTooExp.config
			execute unless score @s nevTooExp.cost matches 0.. run scoreboard players set @s nevTooExp.cost 0
			execute store result entity @s Item.tag.RepairCost int 1 run scoreboard players get @s nevTooExp.cost
			tag @s[scores={nevTooExp.cost=40..}] remove nevTooExp.levelDown
			tag @s[scores={nevTooExp.cost=0}] add nevTooExp.levelDown
			execute if entity @s[tag=nevTooExp.levelDown] run playsound minecraft:entity.player.levelup block @a ~ ~ ~ 1 1.3
			execute unless entity @s[tag=nevTooExp.levelDown] run playsound minecraft:entity.experience_orb.pickup block @a ~ ~ ~ 0.5 1.3
			tag @s remove nevTooExp.levelDown
			scoreboard players operation @s nevTooExp.count = #bottles nevTooExp.config
			execute as @e[type=minecraft:item,tag=nevTooExp.bottle] if score @e[type=minecraft:item,tag=nevTooExp.subject,limit=1] nevTooExp.count matches 1.. run {
				name subtract
				execute if score @s nevTooExp.count > @e[type=minecraft:item,tag=nevTooExp.subject,limit=1] nevTooExp.count run {
					name subtract_portion
					summon minecraft:item ~ ~ ~ {Tags:["nevTooExp.newBottle"],Item:{id:"minecraft:glass_bottle",Count:1b}}
					execute store result entity @e[type=minecraft:item,tag=nevTooExp.newBottle,limit=1] Item.Count byte 1 run scoreboard players get @e[type=minecraft:item,tag=nevTooExp.subject,limit=1] nevTooExp.count
					execute store result entity @s Item.Count byte 1 run scoreboard players operation @s nevTooExp.count -= @e[type=minecraft:item,tag=nevTooExp.subject] nevTooExp.count
					scoreboard players set @e[type=minecraft:item,tag=nevTooExp.subject] nevTooExp.count 0
					tag @e[type=minecraft:item] remove nevTooExp.newBottle
				}
				execute unless score @s nevTooExp.count > @e[type=minecraft:item,tag=nevTooExp.subject,limit=1] nevTooExp.count run {
					name subtract_whole
					data modify entity @s Item.id set value "minecraft:glass_bottle"
					scoreboard players operation @e[type=minecraft:item,tag=nevTooExp.subject] nevTooExp.count -= @s nevTooExp.count
				}
			}
		}
		scoreboard players set @s nevTooExp.count 0
		scoreboard players set @s nevTooExp.cost 0
		tag @e[type=minecraft:item] remove nevTooExp.bottle
		tag @s remove nevTooExp.subject
	}
	scoreboard players enable @a nevTooExp
	execute as @a[scores={nevTooExp=1}] run {
		name info
		tellraw @s [{"text":"Drop an item into a cauldron with ","color":"COLOR_1"},{"score":{"name":"#bottles","objective":"nevTooExp.config"},"color":"COLOR_2"},{"text":" XP bottle(s)","color":"COLOR_2"},{"text":" to reduce the item's repair cost by ","color":"COLOR_1"},{"score":{"name":"#levels","objective":"nevTooExp.config"},"color":"COLOR_2"},{"text":" level(s)","color":"COLOR_2"},{"text":".","color":"COLOR_1"}]
	}
	scoreboard players set @a nevTooExp 0
}
function config {
	function never_too_expensive:info
	tellraw @s [{"text":"Enter","color":"COLOR_3"},{"text":" or ","color":"COLOR_1"},{"text":"click","color":"COLOR_3"},{"text":" on ","color":"COLOR_1"},{"text":"/scoreboard players set #bottles nevTooExp.config <number>","color":"COLOR_2","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #bottles nevTooExp.config "},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to write ","color":"COLOR_1"},{"text":"/scoreboard players set #bottles nevTooExp.config","color":"COLOR_2"},{"text":".\nEnter the number of bottles after clicking.","color":"COLOR_1"}]}},{"text":" to set the number of XP bottles required to reduce an item's repair cost. The default is ","color":"COLOR_1"},{"text":"1","color":"COLOR_2","clickEvent":{"action":"run_command","value":"/scoreboard players set #bottles nevTooExp.config 1"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/scoreboard players set #bottles nevTooExp.config 1","color":"COLOR_2"},{"text":".","color":"COLOR_1"}]}},{"text":". If you have ","color":"COLOR_1"},{"text":"XP Management","color":"COLOR_2"},{"text":" installed, the recommended value is ","color":"COLOR_1"},{"text":"2","color":"COLOR_2","clickEvent":{"action":"run_command","value":"/scoreboard players set #bottles nevTooExp.config 2"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/scoreboard players set #bottles nevTooExp.config 2","color":"COLOR_2"},{"text":".","color":"COLOR_1"}]}},{"text":".","color":"COLOR_1"}]
	tellraw @s [{"text":"Enter","color":"COLOR_3"},{"text":" or ","color":"COLOR_1"},{"text":"click","color":"COLOR_3"},{"text":" on ","color":"COLOR_1"},{"text":"/scoreboard players set #levels nevTooExp.config <number>","color":"COLOR_2","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #levels nevTooExp.config "},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to write ","color":"COLOR_1"},{"text":"/scoreboard players set #levels nevTooExp.config","color":"COLOR_2"},{"text":".\nEnter the number of levels after clicking.","color":"COLOR_1"}]}},{"text":" to set the number of repair cost levels reduced. The default is ","color":"COLOR_1"},{"text":"40","color":"COLOR_2","clickEvent":{"action":"run_command","value":"/scoreboard players set #levels nevTooExp.config 40"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/scoreboard players set #levels nevTooExp.config 40","color":"COLOR_2"},{"text":".","color":"COLOR_1"}]}},{"text":". If you have ","color":"COLOR_1"},{"text":"XP Management","color":"COLOR_2"},{"text":" installed, the recommended value is ","color":"COLOR_1"},{"text":"1","color":"COLOR_2","clickEvent":{"action":"run_command","value":"/scoreboard players set #levels nevTooExp.config 1"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/scoreboard players set #levels nevTooExp.config 1","color":"COLOR_2"},{"text":".","color":"COLOR_1"}]}},{"text":".","color":"COLOR_1"}]
}
