tellraw @a[tag=tpa.target] [{"text":"You have accepted ","color":"COLOR_1"},{"selector":"@s","color":"COLOR_2"},{"text":"'s teleport request.","color":"COLOR_1"}]
tellraw @s ["",{"selector":"@a[tag=tpa.target]","color":"COLOR_2"},{"text":" has accepted your teleport request.","color":"COLOR_1"}]
execute unless score #cooldown tpa.config matches 0 run scoreboard players operation @s tpa.cooldown = #cooldown tpa.config
execute at @s run function back:set_back
tp @s @a[tag=tpa.target,limit=1]
scoreboard players reset @s tpa.target
scoreboard players reset @s tpa.timeout
tag @s remove tpa.sender