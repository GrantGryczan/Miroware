execute as @e[type=minecraft:item] at @s positioned ~ ~-0.25 ~ if block ~ ~ ~ #minecraft:wool if entity @s[nbt={Item:{id:"minecraft:ender_pearl",Count:1b}}] align xyz unless entity @e[type=minecraft:item_frame,tag=elevs.marker,dx=0,dy=0,dz=0] run function elevators:create_elevator
execute as @e[type=minecraft:item_frame,tag=elevs.marker] at @s unless block ~ ~ ~ #minecraft:wool run function elevators:destroy_elevator
execute as @a[scores={elevs.jump=1..}] at @s run function elevators:jump
execute as @a[scores={elevs.sneak=1..}] at @s run function elevators:sneak
schedule function elevators:tick 1t