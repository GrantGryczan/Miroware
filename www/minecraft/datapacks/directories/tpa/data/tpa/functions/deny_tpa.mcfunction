tellraw @a[tag=tpa.target] [{"text":"You have denied ","color":"dark_aqua"},{"selector":"@s","color":"aqua"},{"text":"'s teleport request.","color":"dark_aqua"}]
tellraw @s ["",{"selector":"@a[tag=tpa.target]","color":"red"},{"text":" has denied your teleport request.","color":"red"}]
scoreboard players reset @s tpa.target
scoreboard players reset @s tpa.timeout
tag @s remove tpa.sender