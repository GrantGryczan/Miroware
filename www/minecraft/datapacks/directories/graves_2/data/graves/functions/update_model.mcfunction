execute as @e[type=minecraft:armor_stand,tag=graves.model] run data merge entity @s {Fire:32767s,Air:32767s}
schedule function graves:update_model 20s