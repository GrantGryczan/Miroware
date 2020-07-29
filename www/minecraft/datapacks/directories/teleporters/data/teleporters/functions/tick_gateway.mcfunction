execute if block ~ ~ ~ minecraft:crying_obsidian if block ~ ~2 ~ minecraft:crying_obsidian if block ~ ~1 ~ minecraft:end_gateway run tag @s add tpers.valid
execute unless entity @s[tag=tpers.valid] align xyz positioned ~0.5 ~1.5 ~0.5 run function teleporters:destroy_gateway
tag @s remove tpers.valid