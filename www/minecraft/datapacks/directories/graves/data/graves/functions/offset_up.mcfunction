tp @s ~ ~ ~
execute unless predicate graves:valid positioned ~ ~1 ~ run function graves:offset_up
execute if predicate graves:valid if entity @e[dx=0,dy=0,dz=0,type=minecraft:armor_stand,tag=!graves.new,nbt=!{Marker:1b}] positioned ~ ~1 ~ run function graves:offset_up