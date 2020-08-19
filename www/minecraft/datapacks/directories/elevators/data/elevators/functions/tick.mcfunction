schedule function elevators:tick 1t
execute as @e[type=minecraft:item_frame,tag=elevs.marker] at @s unless block ~ ~ ~ #minecraft:wool run function elevators:destroy_elevator
execute as @a[scores={elevs.jump=1..}] at @s run function elevators:jump
execute as @a[scores={elevs.sneak=1..}] at @s run function elevators:sneak