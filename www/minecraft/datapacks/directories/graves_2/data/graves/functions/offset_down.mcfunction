tp @s ~ ~ ~
execute unless entity @s[y=0,dy=0] positioned ~ ~-1 ~ if predicate graves:valid unless entity @e[dx=0,dy=0,dz=0,type=minecraft:armor_stand,tag=!graves.new,nbt=!{Marker:1b}] run function graves:offset_down
execute if entity @s[y=0,dy=0] at @e[type=minecraft:area_effect_cloud,tag=graves.start] run tp @s ~ ~ ~