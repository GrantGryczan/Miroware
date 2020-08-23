execute if score @s tpa.cooldown matches 1.. run tellraw @s [{"text":"Your TPA cooldown will end in ","color":"red"},{"score":{"name":"@s","objective":"tpa.cooldown"},"color":"red"},{"text":" seconds.","color":"red"}]
execute unless score @s tpa.cooldown matches 1.. run function tpa:send_tpa
scoreboard players set @s tpa 0