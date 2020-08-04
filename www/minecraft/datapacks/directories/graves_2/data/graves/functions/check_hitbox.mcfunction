execute store result score @s graves.id run data get entity @s HandItems[1].tag.gravesData.id
execute if score @s graves.id = #activated graves.dummy run tag @s add graves.activated