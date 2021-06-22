tp @s ~ ~ ~
execute positioned ~ ~-1 ~ if block ~ ~ ~ #spawn:valid_spawn_location run function spawn:offset_down
execute positioned ~ ~-1 ~ unless predicate spawn:loaded at @e[type=minecraft:marker,tag=spawn.start] run tp @s ~ ~ ~