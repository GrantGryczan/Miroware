summon minecraft:item ~ ~ ~ {Tags:["graves.item"],Item:{id:"minecraft:stone_button",Count:1b}}
data modify entity @e[type=minecraft:item,tag=graves.item,limit=1] Item set from entity @s ArmorItems[3]
execute as @a[tag=graves.subject] run function graves:set_owner
tag @e[type=minecraft:item] remove graves.item