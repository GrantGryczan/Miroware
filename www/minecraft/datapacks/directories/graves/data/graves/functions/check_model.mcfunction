execute store result score #id graves.dummy run data get entity @s ArmorItems[3].tag.gravesData.id
execute if score #id graves.dummy = #activated graves.dummy run kill @s
scoreboard players operation @s graves.id = #id graves.dummy