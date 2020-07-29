summon minecraft:item ~ ~ ~ {Tags:["nevTooExp.newBottle"],Item:{id:"minecraft:glass_bottle",Count:1b}}
execute store result entity @e[type=minecraft:item,tag=nevTooExp.newBottle,limit=1] Item.Count byte 1 run scoreboard players get @e[type=minecraft:item,tag=nevTooExp.subject,limit=1] nevTooExp.count
execute store result entity @s Item.Count byte 1 run scoreboard players operation @s nevTooExp.count -= @e[type=minecraft:item,tag=nevTooExp.subject] nevTooExp.count
scoreboard players set @e[type=minecraft:item,tag=nevTooExp.subject] nevTooExp.count 0
tag @e[type=minecraft:item] remove nevTooExp.newBottle