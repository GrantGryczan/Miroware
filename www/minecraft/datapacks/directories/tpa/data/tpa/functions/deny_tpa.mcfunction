tellraw @a[tag=tpa.target] [{"text":"You have denied ","color":"COLOR_1"},{"selector":"@s","color":"COLOR_2"},{"text":"'s teleport request.","color":"COLOR_1"}]
tellraw @s ["",{"selector":"@a[tag=tpa.target]","color":"red"},{"text":" has denied your teleport request.","color":"red"}]
scoreboard players reset @s tpa.target
scoreboard players reset @s tpa.timeout
tag @s remove tpa.sender