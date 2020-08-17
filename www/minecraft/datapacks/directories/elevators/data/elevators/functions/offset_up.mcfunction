execute if block ~ ~ ~ #minecraft:wool align xyz if entity @e[type=minecraft:item_frame,tag=elevs.marker,dx=0,dy=0,dz=0] run function elevators:check_color
execute unless entity @s[tag=elevs.continue] positioned ~ ~1.1 ~ run function elevators:teleport
execute if entity @s[tag=elevs.continue] if predicate elevators:loaded positioned ~ ~1 ~ align y run function elevators:offset_up