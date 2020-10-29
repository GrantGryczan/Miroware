execute store result score @s graves.id run data get entity @s ArmorItems[3].tag.gravesData.id
execute if score @s graves.id = #activated graves.dummy run kill @s