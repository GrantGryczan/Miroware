scoreboard players operation @s homes.target = #home homes.dummy
scoreboard players operation @s homes.delay = #delay homes.config
execute store result score @s homes.x run data get entity @s Pos[0] 10
execute store result score @s homes.y run data get entity @s Pos[1] 10
execute store result score @s homes.z run data get entity @s Pos[2] 10
execute if data storage homes:storage players[-1].homes[-1].name run tag @s add homes.nameSet
execute if entity @s[tag=homes.nameSet] run tellraw @s [{"text":"Teleporting to ","color":"COLOR_1"},{"storage":"homes:storage","nbt":"players[-1].homes[-1].name","interpret":true,"color":"COLOR_2"},{"text":"...","color":"COLOR_1"}]
execute unless entity @s[tag=homes.nameSet] if score #home homes.dummy matches 1 run tellraw @s [{"text":"Teleporting to ","color":"COLOR_1"},{"text":"Home","color":"COLOR_2"},{"text":"...","color":"COLOR_1"}]
execute unless entity @s[tag=homes.nameSet] unless score #home homes.dummy matches 1 run tellraw @s [{"text":"Teleporting to ","color":"COLOR_1"},{"text":"Home ","color":"COLOR_2"},{"score":{"name":"#home","objective":"homes.dummy"},"color":"COLOR_2"},{"text":"...","color":"COLOR_1"}]
tag @s remove homes.nameSet