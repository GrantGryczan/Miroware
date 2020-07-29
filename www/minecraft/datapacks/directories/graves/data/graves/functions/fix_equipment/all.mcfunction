execute store result score #count graves.dummy run data get entity @s ArmorItems[0].Count
execute if score #count graves.dummy matches 1 run function graves:fix_equipment/check_0
execute unless score #count graves.dummy matches 2 run data modify entity @s ArmorItems[0] set from entity @s HandItems[1]
execute store result score #count graves.dummy run data get entity @s ArmorItems[1].Count
execute if score #count graves.dummy matches 1 run function graves:fix_equipment/check_1
execute unless score #count graves.dummy matches 2 run data modify entity @s ArmorItems[1] set from entity @s HandItems[1]
execute store result score #count graves.dummy run data get entity @s ArmorItems[2].Count
execute if score #count graves.dummy matches 1 run function graves:fix_equipment/check_2
execute unless score #count graves.dummy matches 2 run data modify entity @s ArmorItems[2] set from entity @s HandItems[1]
execute store result score #count graves.dummy run data get entity @s ArmorItems[3].Count
execute if score #count graves.dummy matches 1 run function graves:fix_equipment/check_3
execute unless score #count graves.dummy matches 2 run data modify entity @s ArmorItems[3] set from entity @s HandItems[1]
execute if score #failed graves.dummy matches 1 run tag @s remove graves.activated
scoreboard players set #failed graves.dummy 0