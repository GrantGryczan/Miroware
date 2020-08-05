scoreboard players set #success spawn.dummy 0
execute store result score #value spawn.dummy run data get entity @s Pos[1] 10
execute if score #value spawn.dummy = @s spawn.y run function spawn:check_x
scoreboard players reset @s spawn.x
scoreboard players reset @s spawn.y
scoreboard players reset @s spawn.z
execute if score #success spawn.dummy matches 0 run tellraw @s [{"text":"You must stand still to teleport.","color":"red"}]
execute unless score #success spawn.dummy matches 0 run function spawn:go_to_spawn
scoreboard players reset @s spawn.delay