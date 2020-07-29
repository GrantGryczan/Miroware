forceload add ~ ~
summon minecraft:item_frame ~ ~ ~ {Tags:["back.dimension","back.new"],Fixed:1b,Invisible:1b,Item:{id:"minecraft:stone_button",Count:1b,tag:{backData:{}}}}
execute store result score #id back.dummy run data get storage back:storage lastDimension
execute store result entity @e[type=minecraft:item_frame,tag=back.new,limit=1] Item.tag.backData.id int 1 run scoreboard players add #id back.dummy 1
execute store result storage back:storage lastDimension int 1 run scoreboard players get #id back.dummy
data modify entity @e[type=minecraft:item_frame,tag=back.new,limit=1] Item.tag.backData.name set from entity @s Dimension
tag @e[type=minecraft:item_frame] remove back.new