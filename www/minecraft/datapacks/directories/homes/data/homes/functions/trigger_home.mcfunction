execute if score @s homes.cooldown matches 1.. run tellraw @s [{"text":"Your Homes cooldown will end in ","color":"red"},{"score":{"name":"@s","objective":"homes.cooldown"},"color":"red"},{"text":" seconds.","color":"red"}]
execute unless score @s homes.cooldown matches 1.. run function homes:try_to_start_to_go_home
scoreboard players set @s home 0