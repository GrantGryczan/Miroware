execute store result entity @s ArmorItems[3].tag.gravesData.id int 1 run scoreboard players get #id graves.dummy
scoreboard players operation @s graves.id = #id graves.dummy
execute if entity @a[tag=graves.player,y_rotation=-45..45] run tp @s ~ ~ ~ ~90 ~
execute if entity @a[tag=graves.player,y_rotation=135..225] run tp @s ~ ~ ~ ~90 ~
tp @s ~ ~-1.375 ~
tag @s remove graves.new