execute if score @s homes.timer matches 0 run function homes:try_to_try_to_go_home
execute unless score @s homes.timer matches 0 run scoreboard players remove @s homes.timer 1