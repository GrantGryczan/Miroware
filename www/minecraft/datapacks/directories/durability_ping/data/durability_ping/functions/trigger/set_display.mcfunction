scoreboard players operation @s duraPing.config /= #10 duraPing.dummy
scoreboard players operation @s duraPing.config *= #10 duraPing.dummy
execute if score @s duraPing matches 13 run scoreboard players add @s duraPing.config 1
execute if score @s duraPing matches 14 run scoreboard players add @s duraPing.config 2
execute if score @s duraPing matches 15 run scoreboard players add @s duraPing.config 3
execute if score @s duraPing matches 16 run scoreboard players add @s duraPing.config 4