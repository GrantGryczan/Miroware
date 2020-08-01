tag @s add tpa.sender
tellraw @s {"text":"Your teleport request has timed out after five minutes.","color":"red"}
execute as @a if score @s tpa.pid = @a[tag=tpa.sender,limit=1] tpa.target run tellraw @s ["",{"selector":"@a[tag=tpa.sender]","color":"red"},{"text":"'s teleport request has timed out after five minutes.","color":"red"}]
scoreboard players reset @s tpa.target
scoreboard players reset @s tpa.timeout
tag @s remove tpa.sender