execute store result score #dimension back.dummy run data get storage back:storage players[-1].back.dim
execute as @e[type=minecraft:item_frame,tag=back.dimension] run function back:try_to_summon_destination
execute as @e[type=minecraft:area_effect_cloud,tag=back.destination] run function back:set_destination
execute at @s run function back:set_back
tp @s @e[type=minecraft:area_effect_cloud,tag=back.destination,limit=1]
kill @e[type=minecraft:area_effect_cloud,tag=back.destination]