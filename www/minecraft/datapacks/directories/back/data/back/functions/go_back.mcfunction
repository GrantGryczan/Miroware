execute store result score #dimension back.dummy run data get storage back:storage players[-1].back.dim
execute as @e[type=minecraft:item_frame,tag=back.dimension] run function back:try_to_summon_destination
data modify entity 669174e3-21f4-4acc-b312-2551646e530b Pos set from storage back:storage players[-1].back.pos
data modify entity 669174e3-21f4-4acc-b312-2551646e530b Rotation set from storage back:storage players[-1].back.rot
execute at @s run function back:set_back
tp @s 669174e3-21f4-4acc-b312-2551646e530b
kill 669174e3-21f4-4acc-b312-2551646e530b