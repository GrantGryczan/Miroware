tellraw @a[tag=tpa.target] [{"text":"You have accepted ","color":"dark_aqua"},{"selector":"@s","color":"aqua"},{"text":"'s teleport request.","color":"dark_aqua"}]
tellraw @s ["",{"selector":"@a[tag=tpa.target]","color":"aqua"},{"text":" has accepted your teleport request.","color":"dark_aqua"}]
tp @s @a[tag=tpa.target,limit=1]
scoreboard players reset @s tpa.target
scoreboard players reset @s tpa.timeout
tag @s remove tpa.sender