execute store result score #dimension back.dummy run data get storage back:storage players[-1].back.dim
execute as @e[type=minecraft:item_frame,tag=back.dimension] run function back:try_to_summon_destination
execute unless score #cooldown back.config matches 0 run scoreboard players operation @s back.cooldown = #cooldown back.config
tag @s add back.subject
execute as @e[type=minecraft:area_effect_cloud,tag=back.destination] run function back:set_destination
tag @s remove back.subject