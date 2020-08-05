function back:rotate/players
scoreboard players set #success back.dummy 0
execute store result score #value back.dummy run data get entity @s Pos[1] 10
execute if score #value back.dummy = @s back.y run function back:check_x
scoreboard players reset @s back.x
scoreboard players reset @s back.y
scoreboard players reset @s back.z
execute if score #success back.dummy matches 0 run tellraw @s [{"text":"You must stand still to teleport.","color":"red"}]
execute unless score #success back.dummy matches 0 run function back:try_to_go_back
scoreboard players reset @s back.delay