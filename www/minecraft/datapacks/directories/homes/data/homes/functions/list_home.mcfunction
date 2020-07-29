scoreboard players set #id1 homes.dummy 0
scoreboard players set #id2 homes.dummy 0
execute unless score #remaining homes.dummy matches 1 run function homes:bubble
execute store result score #dimension homes.dummy run data get storage homes:storage temp[0].dim
execute as @e[type=minecraft:item_frame,tag=homes.dimension] run function homes:check_dimension_marker
execute store result score #id homes.dummy run data get storage homes:storage temp[0].id
execute store result score #x homes.dummy run data get storage homes:storage temp[0].pos[0]
execute store result score #y homes.dummy run data get storage homes:storage temp[0].pos[1]
execute store result score #z homes.dummy run data get storage homes:storage temp[0].pos[2]
execute if data storage homes:storage temp[0].name run tag @s add homes.nameSet
execute if entity @s[tag=homes.nameSet] run tellraw @s [{"score":{"name":"#id","objective":"homes.dummy"},"color":"dark_aqua"},{"text":". ","color":"dark_aqua"},{"storage":"homes:storage","nbt":"temp[0].name","interpret":true,"color":"aqua"},{"text":" at (","color":"dark_aqua"},{"score":{"name":"#x","objective":"homes.dummy"},"color":"dark_aqua"},{"text":", ","color":"dark_aqua"},{"score":{"name":"#y","objective":"homes.dummy"},"color":"dark_aqua"},{"text":", ","color":"dark_aqua"},{"score":{"name":"#z","objective":"homes.dummy"},"color":"dark_aqua"},{"text":") in ","color":"dark_aqua"},{"entity":"@e[type=minecraft:item_frame,tag=homes.target,limit=1]","nbt":"Item.tag.homesData.name","color":"dark_aqua"}]
execute unless entity @s[tag=homes.nameSet] if score #id homes.dummy matches 1 run tellraw @s [{"text":"1. ","color":"dark_aqua"},{"text":"Home","color":"aqua"},{"text":" at (","color":"dark_aqua"},{"score":{"name":"#x","objective":"homes.dummy"},"color":"dark_aqua"},{"text":", ","color":"dark_aqua"},{"score":{"name":"#y","objective":"homes.dummy"},"color":"dark_aqua"},{"text":", ","color":"dark_aqua"},{"score":{"name":"#z","objective":"homes.dummy"},"color":"dark_aqua"},{"text":") in ","color":"dark_aqua"},{"entity":"@e[type=minecraft:item_frame,tag=homes.target,limit=1]","nbt":"Item.tag.homesData.name","color":"dark_aqua"}]
execute unless entity @s[tag=homes.nameSet] unless score #id homes.dummy matches 1 run tellraw @s [{"score":{"name":"#id","objective":"homes.dummy"},"color":"dark_aqua"},{"text":". ","color":"dark_aqua"},{"text":"Home ","color":"aqua"},{"score":{"name":"#id","objective":"homes.dummy"},"color":"aqua"},{"text":" at (","color":"dark_aqua"},{"score":{"name":"#x","objective":"homes.dummy"},"color":"dark_aqua"},{"text":", ","color":"dark_aqua"},{"score":{"name":"#y","objective":"homes.dummy"},"color":"dark_aqua"},{"text":", ","color":"dark_aqua"},{"score":{"name":"#z","objective":"homes.dummy"},"color":"dark_aqua"},{"text":") in ","color":"dark_aqua"},{"entity":"@e[type=minecraft:item_frame,tag=homes.target,limit=1]","nbt":"Item.tag.homesData.name","color":"dark_aqua"}]
tag @s remove homes.nameSet
tag @e[type=minecraft:item_frame,tag=homes.dimension] remove homes.target
data remove storage homes:storage temp[0]
execute store result score #remaining homes.dummy run scoreboard players remove #homes homes.dummy 1
data modify storage homes:storage temp set from storage homes:storage temp2
data modify storage homes:storage temp2 set value []
execute unless score #homes homes.dummy matches 0 run function homes:list_home