execute if score @s spawn.cooldown matches 1.. run tellraw @s [{"text":"Your Spawn cooldown will end in ","color":"red"},{"score":{"name":"@s","objective":"spawn.cooldown"},"color":"red"},{"text":" seconds.","color":"red"}]
execute unless score @s spawn.cooldown matches 1.. run function spawn:start_to_go_to_spawn
scoreboard players set @s spawn 0