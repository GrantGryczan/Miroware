execute if score @s back.cooldown matches 1.. run tellraw @s [{"text":"Your Back cooldown will end in ","color":"red"},{"score":{"name":"@s","objective":"back.cooldown"},"color":"red"},{"text":" seconds.","color":"red"}]
execute unless score @s back.cooldown matches 1.. run function back:try_to_start_to_go_back
scoreboard players set @s back 0