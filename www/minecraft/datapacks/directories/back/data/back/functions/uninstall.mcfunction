schedule clear back:tick
schedule clear back:decrement_cooldowns
schedule clear back:check_game_rules
schedule clear back:try_to_mark_dimension
execute as @e[type=minecraft:marker,tag=back.dimension] at @s run function back:remove_dimension_marker
data remove storage back:storage players
data remove storage back:storage temp
scoreboard objectives remove back
scoreboard objectives remove back.config
scoreboard objectives remove back.dummy
scoreboard objectives remove back.delay
scoreboard objectives remove back.cooldown
scoreboard objectives remove back.deaths
scoreboard objectives remove back.x
scoreboard objectives remove back.y
scoreboard objectives remove back.z