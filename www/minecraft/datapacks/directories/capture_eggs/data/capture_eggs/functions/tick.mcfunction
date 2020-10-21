schedule function capture_eggs:tick 1t
execute as @e[type=minecraft:egg] at @s if entity @e[type=#capture_eggs:capturable,distance=..5] run function capture_eggs:tick_egg