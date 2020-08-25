execute store result storage homes:storage players[-1].homes[-1].id int 1 run scoreboard players get #home homes.dummy
data modify storage homes:storage players[-1].homes[-1].dim set from entity @e[type=minecraft:item_frame,tag=homes.dimension,distance=0..,limit=1] Item.tag.homesData.id
data modify storage homes:storage players[-1].homes[-1].pos set from entity @s Pos
data modify storage homes:storage players[-1].homes[-1].rot set from entity @s Rotation
execute if data storage homes:storage players[-1].homes[-1].name run tag @s add homes.nameSet
execute if entity @s[tag=homes.nameSet] run tellraw @s [{"storage":"homes:storage","nbt":"players[-1].homes[-1].name","interpret":true,"color":"COLOR_2"},{"text":" set.","color":"COLOR_1"}]
execute unless entity @s[tag=homes.nameSet] if score #home homes.dummy matches 1 run tellraw @s [{"text":"Home","color":"COLOR_2"},{"text":" set.","color":"COLOR_1"}]
execute unless entity @s[tag=homes.nameSet] unless score #home homes.dummy matches 1 run tellraw @s [{"text":"Home ","color":"COLOR_2"},{"score":{"name":"#home","objective":"homes.dummy"},"color":"COLOR_2"},{"text":" set.","color":"COLOR_1"}]
tag @s remove homes.nameSet