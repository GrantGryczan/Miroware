forceload add ~ ~
summon minecraft:item_frame ~ ~ ~ {Tags:["homes.dimension","homes.new"],Fixed:1b,Invisible:1b,Item:{id:"minecraft:stone_button",Count:1b,tag:{homesData:{}}}}
execute store result score #id homes.dummy run data get storage homes:storage lastDimension
execute store result entity @e[type=minecraft:item_frame,tag=homes.new,limit=1] Item.tag.homesData.id int 1 run scoreboard players add #id homes.dummy 1
execute store result storage homes:storage lastDimension int 1 run scoreboard players get #id homes.dummy
data modify entity @e[type=minecraft:item_frame,tag=homes.new,limit=1] Item.tag.homesData.name set from entity @s Dimension
tag @e[type=minecraft:item_frame] remove homes.new