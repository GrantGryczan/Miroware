tag @s add tpa.target
execute as @a if score @s tpa.target = @a[tag=tpa.target,limit=1] tpa.pid run tag @s add tpa.sender
execute unless score @s tpaccept matches 0 as @a unless score @s tpa.pid = @a[tag=tpa.target,limit=1] tpaccept run tag @s remove tpa.sender
execute unless score @s tpaccept matches 0 unless entity @a[tag=tpa.sender] run tellraw @s [{"text":"You have no active teleport requests from a player with PID ","color":"red"},{"score":{"name":"@s","objective":"tpaccept"},"color":"red"},{"text":" to accept.","color":"red"}]
execute if score @s tpaccept matches 0 unless entity @a[tag=tpa.sender] run tellraw @s {"text":"You have no active teleport requests to accept.","color":"red"}
execute if score @s tpaccept matches 0 as @a[tag=tpa.sender] run function tpa:untag_older_senders
execute as @a[tag=tpa.sender] run function tpa:accept_tpa
tag @s remove tpa.target