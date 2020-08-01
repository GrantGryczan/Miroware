tag @s add tpa.sender
execute as @a if score @s tpa.pid = @a[tag=tpa.sender,limit=1] tpa run tag @s add tpa.target
execute unless entity @a[tag=tpa.target] run tellraw @s [{"text":"No player with PID ","color":"red"},{"score":{"name":"@s","objective":"tpa"},"color":"red"},{"text":" was found.","color":"red"}]
execute if entity @s[tag=tpa.target] run tellraw @s {"text":"You cannot send a teleport request to yourself.","color":"red"}
execute as @a[tag=!tpa.sender,tag=tpa.target,limit=1] run function tpa:receive_tpa
tag @s remove tpa.sender
tag @a[tag=tpa.target] remove tpa.target