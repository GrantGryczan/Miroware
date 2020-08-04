function graves:remove_vanishing_item
execute if score #xp graves.config matches 1 if score #xp graves.dummy matches 1.. run function graves:store_xp
data modify entity @s HandItems[1].tag.gravesData.uuidMost set from entity @a[tag=graves.player,limit=1] UUIDMost
data modify entity @s HandItems[1].tag.gravesData.uuidLeast set from entity @a[tag=graves.player,limit=1] UUIDLeast
execute store result entity @s HandItems[1].tag.gravesData.id int 1 run scoreboard players get #id graves.dummy
scoreboard players operation @s graves.id = #id graves.dummy
data modify entity @s ArmorItems[0] set from entity @s HandItems[1]
data modify entity @s ArmorItems[1] set from entity @s HandItems[1]
data modify entity @s ArmorItems[2] set from entity @s HandItems[1]
data modify entity @s ArmorItems[3] set from entity @s HandItems[1]
execute store result score #y graves.dummy run data get entity @s Pos[1]
execute if score #y graves.dummy matches ..0 run tp @s ~ 1 ~
execute at @s run summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["graves.start"]}
execute at @s run function graves:offset_up
execute at @s if predicate graves:valid unless entity @e[dx=0,dy=0,dz=0,type=minecraft:armor_stand,tag=!graves.new,nbt=!{Marker:1b}] run function graves:offset_down
kill @e[type=minecraft:area_effect_cloud,tag=graves.start]
execute at @s positioned ~ ~-1 ~ if predicate graves:valid unless entity @e[dx=0,dy=0,dz=0,type=minecraft:armor_stand,tag=!graves.new,nbt=!{Marker:1b}] run setblock ~ ~ ~ minecraft:grass_block
tag @s remove graves.new
execute at @s run tp ~0.5 ~ ~0.5
execute store result storage graves:storage players[-1].graves[-1].x int 1 run data get entity @s Pos[0]
execute store result storage graves:storage players[-1].graves[-1].y int 1 run data get entity @s Pos[1]
execute store result storage graves:storage players[-1].graves[-1].z int 1 run data get entity @s Pos[2]
execute at @s run function graves:create_model
execute if score #locating graves.config matches 1 as @a[tag=graves.player] run function graves:display_grave_location