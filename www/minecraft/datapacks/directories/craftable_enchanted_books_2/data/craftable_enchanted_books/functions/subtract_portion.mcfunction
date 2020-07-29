summon minecraft:item ~ ~ ~ {Tags:["craEncBoo.newBottle"],Item:{id:"minecraft:glass_bottle",Count:1b}}
execute store result entity @e[type=minecraft:item,tag=craEncBoo.newBottle,limit=1] Item.Count byte 1 run scoreboard players get #cost craEncBoo.dummy
execute store result entity @s Item.Count byte 1 run scoreboard players operation @s craEncBoo.count -= #cost craEncBoo.dummy
scoreboard players set #cost craEncBoo.dummy 0
tag @e[type=minecraft:item] remove craEncBoo.newBottle