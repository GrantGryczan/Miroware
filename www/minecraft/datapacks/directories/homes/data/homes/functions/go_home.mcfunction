execute store result score #dimension homes.dummy run data get storage homes:storage players[-1].homes[-1].dim
execute as @e[type=minecraft:item_frame,tag=homes.dimension] run function homes:try_to_summon_destination
execute at @s run function back:set_back
tag @s add homes.subject
execute as @e[type=minecraft:area_effect_cloud,tag=homes.destination] run function homes:set_destination
tag @s remove homes.subject