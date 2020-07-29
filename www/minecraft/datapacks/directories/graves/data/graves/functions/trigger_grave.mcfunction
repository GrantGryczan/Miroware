execute if score #locating graves.config matches 0 run tellraw @s {"text":"Grave locating is disabled.","color":"red"}
execute if score #locating graves.config matches 1 run function graves:locate_grave
scoreboard players set @a grave 0