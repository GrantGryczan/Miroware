execute store result score @s graves.id run data get entity @s HandItems[1].tag.gravesData.id
data modify entity @s ArmorItems[0] set from entity @s HandItems[1]
data modify entity @s ArmorItems[1] set from entity @s HandItems[1]
data modify entity @s ArmorItems[2] set from entity @s HandItems[1]
data modify entity @s ArmorItems[3] set from entity @s HandItems[1]