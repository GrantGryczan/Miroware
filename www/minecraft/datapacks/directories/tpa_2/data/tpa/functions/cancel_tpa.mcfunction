tag @s add tpa.cancelSender
execute if entity @s[tag=tpa.sender] run tellraw @s {"text":"You have cancelled your previous teleport request.","color":"red"}
execute unless entity @s[tag=tpa.sender] run tellraw @s {"text":"You have cancelled your teleport request.","color":"dark_aqua"}
execute as @a if score @s tpa.pid = @a[tag=tpa.cancelSender,limit=1] tpa.target run tellraw @s ["",{"selector":"@a[tag=tpa.cancelSender]","color":"red"},{"text":" has cancelled their teleport request.","color":"red"}]
scoreboard players set @s tpa.target 0
scoreboard players set @s tpa.time 0
tag @s remove tpa.cancelSender