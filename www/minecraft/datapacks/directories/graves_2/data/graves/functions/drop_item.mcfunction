summon minecraft:item ~ ~0.2 ~ {Tags:["graves.item"],Item:{id:"minecraft:bone",Count:1b}}
data modify entity @e[type=minecraft:item,tag=graves.item,limit=1] Item set from entity @s HandItems[0].tag.gravesData.items[0]
execute as @a[tag=graves.subject,predicate=graves:sneaking,limit=1] run data modify entity @e[type=minecraft:item,tag=graves.item,limit=1] Owner set from entity @s UUID
tag @e[type=minecraft:item,tag=graves.item] remove graves.item
data remove entity @s HandItems[0].tag.gravesData.items[0]
scoreboard players remove #remaining graves.dummy 1
execute if score #remaining graves.dummy matches 1.. run function graves:drop_item