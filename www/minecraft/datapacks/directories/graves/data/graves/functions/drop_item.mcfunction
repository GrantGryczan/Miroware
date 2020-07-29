summon minecraft:item ~ ~0.2 ~ {Tags:["graves.item"],Item:{id:"minecraft:bone",Count:1b}}
data modify entity @e[type=minecraft:item,tag=graves.item,limit=1] Item set from entity @s HandItems[0].tag.gravesData.items[0]
execute as @a[tag=graves.subject,limit=1] if score @s graves.sneak matches 1.. run function graves:set_owner
tag @e[type=minecraft:item,tag=graves.item] remove graves.item
data remove entity @s HandItems[0].tag.gravesData.items[0]
execute if data entity @s HandItems[0].tag.gravesData.items[0] run function graves:drop_item