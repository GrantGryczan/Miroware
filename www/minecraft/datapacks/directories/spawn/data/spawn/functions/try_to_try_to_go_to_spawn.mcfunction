execute if score @s spawn.timer matches 0 run function spawn:try_to_go_to_spawn
execute unless score @s spawn.timer matches 0 run scoreboard players remove @s spawn.timer 1