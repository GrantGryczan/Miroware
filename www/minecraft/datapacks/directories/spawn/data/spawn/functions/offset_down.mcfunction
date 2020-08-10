tp @s ~ ~ ~
execute positioned ~ ~-1 ~ if block ~ ~ ~ #spawn:passable run function spawn:offset_down
execute if entity @s[y=0,dy=0] at @e[type=minecraft:area_effect_cloud,tag=spawn.destination] run tp @s ~ ~ ~