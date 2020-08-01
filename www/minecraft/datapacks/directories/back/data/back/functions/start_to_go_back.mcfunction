scoreboard players operation @s back.delay = #delay back.config
execute store result score @s back.x run data get entity @s Pos[0] 10
execute store result score @s back.y run data get entity @s Pos[1] 10
execute store result score @s back.z run data get entity @s Pos[2] 10
tellraw @s [{"text":"Teleporting back...","color":"dark_aqua"}]