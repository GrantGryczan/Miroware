execute store result score #dimension homes.dummy run data get storage homes:storage players[-1].homes[-1].dim
execute as @e[type=minecraft:item_frame,tag=homes.dimension] run function homes:try_to_summon_destination
data modify entity 669174e3-21f4-4acc-b312-2551646e530b Pos set from storage homes:storage players[-1].homes[-1].pos
data modify entity 669174e3-21f4-4acc-b312-2551646e530b Rotation set from storage homes:storage players[-1].homes[-1].rot
execute at @s run function back:set_back
tp @s 669174e3-21f4-4acc-b312-2551646e530b
kill 669174e3-21f4-4acc-b312-2551646e530b