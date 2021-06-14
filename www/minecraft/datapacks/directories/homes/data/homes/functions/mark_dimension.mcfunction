summon minecraft:marker ~ ~ ~ {Tags:["homes.dimension","homes.newDimension"]}
data modify entity @e[type=minecraft:marker,tag=homes.newDimension,limit=1,distance=..0.01] data.Dimension set from entity @s Item.tag.homesData.markDimension
tag @e[type=minecraft:marker,tag=homes.newDimension,limit=1,distance=..0.01] remove homes.newDimension
kill @s
scoreboard players set #marked homes.dummy 1