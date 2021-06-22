function graves:remove_vanishing_item
execute if score #xp graves.config matches 1 if score #xp graves.dummy matches 1.. run function graves:store_xp
data modify entity @s HandItems[1].tag.gravesData.uuid set from entity @a[tag=graves.player,limit=1] UUID
execute store result entity @s HandItems[1].tag.gravesData.id int 1 run scoreboard players get #id graves.dummy
scoreboard players operation @s graves.id = #id graves.dummy
data modify entity @s ArmorItems[0] set from entity @s HandItems[1]
data modify entity @s ArmorItems[1] set from entity @s HandItems[1]
data modify entity @s ArmorItems[2] set from entity @s HandItems[1]
data modify entity @s ArmorItems[3] set from entity @s HandItems[1]
execute store success score #forceloadSuccess graves.dummy run forceload add ~ ~
execute store result score #graveY graves.dummy run data get entity @s Pos[1]
scoreboard players set #y graves.dummy -2048
scoreboard players set #foundBottom graves.dummy 0
scoreboard players set #bottomY graves.dummy 0
scoreboard players set #foundTop graves.dummy 0
execute positioned ~ -2048 ~ run function graves:check_for_world_bottom
execute at @s run summon minecraft:marker ~ ~ ~ {Tags:["graves.start"]}
execute at @s run function graves:try_to_offset_up
execute at @s if predicate graves:valid_grave_location unless entity @e[dx=0,dy=0,dz=0,type=minecraft:armor_stand,tag=!graves.new,nbt=!{Marker:1b}] run function graves:try_to_offset_down
kill @e[type=minecraft:marker,tag=graves.start]
execute at @s positioned ~ ~-1 ~ if predicate graves:valid_grave_location unless entity @e[dx=0,dy=0,dz=0,type=minecraft:armor_stand,tag=!graves.new,nbt=!{Marker:1b}] run setblock ~ ~ ~ minecraft:grass_block destroy
execute if score #forceloadSuccess graves.dummy matches 1 run forceload remove ~ ~
tag @s remove graves.new
execute at @s run tp @s ~0.5 ~ ~0.5
execute store result storage graves:storage players[-1].graves[-1].x int 1 run data get entity @s Pos[0]
execute store result storage graves:storage players[-1].graves[-1].y int 1 run data get entity @s Pos[1]
execute store result storage graves:storage players[-1].graves[-1].z int 1 run data get entity @s Pos[2]
execute at @s run function graves:create_model
execute if score #locating graves.config matches 1 as @a[tag=graves.player] run tellraw @s [{"text":"Your last grave is at ","color":"COLOR_1"},{"text":"(","color":"COLOR_2"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].x","color":"COLOR_2"},{"text":", ","color":"COLOR_2"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].y","color":"COLOR_2"},{"text":", ","color":"COLOR_2"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].z","color":"COLOR_2"},{"text":")","color":"COLOR_2"},{"text":" in ","color":"COLOR_1"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].dim"},{"text":".","color":"COLOR_1"}]