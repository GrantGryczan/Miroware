execute store result score #id graves.dummy run data get entity @s HandItems[1].tag.gravesData.id
execute if score #id graves.dummy = #activated graves.dummy run tag @s add graves.activated
scoreboard players operation @s graves.id = #id graves.dummy