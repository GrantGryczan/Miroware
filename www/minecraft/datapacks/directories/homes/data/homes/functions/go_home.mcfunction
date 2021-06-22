tag @s add homes.subject
kill @e[type=minecraft:marker,tag=homes.destination]
execute as @e[type=minecraft:marker,tag=homes.dimension] run function homes:try_to_summon_destination
execute unless entity @e[type=minecraft:marker,tag=homes.destination,limit=1] run tellraw @s {"text":"The destination has not loaded yet. Try again.","color":"red"}
execute as @e[type=minecraft:marker,tag=homes.destination,limit=1] run function homes:set_destination
tag @s remove homes.subject