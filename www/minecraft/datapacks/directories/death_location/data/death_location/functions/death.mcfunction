execute store result score #x deaLoc.dummy run data get entity @s Pos[0]
execute store result score #y deaLoc.dummy run data get entity @s Pos[1]
execute store result score #z deaLoc.dummy run data get entity @s Pos[2]
tellraw @s [{"text":"Death location: ","color":"COLOR_1"},{"text":"(","color":"COLOR_2"},{"score":{"name":"#x","objective":"deaLoc.dummy"},"color":"COLOR_2"},{"text":", ","color":"COLOR_2"},{"score":{"name":"#y","objective":"deaLoc.dummy"},"color":"COLOR_2"},{"text":", ","color":"COLOR_2"},{"score":{"name":"#z","objective":"deaLoc.dummy"},"color":"COLOR_2"},{"text":")","color":"COLOR_2"},{"text":" in ","color":"COLOR_1"},{"entity":"@s","nbt":"Dimension","color":"COLOR_1"}]
scoreboard players reset @s deaLoc.deaths