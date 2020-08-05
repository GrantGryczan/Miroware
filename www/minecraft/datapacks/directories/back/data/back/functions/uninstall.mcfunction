execute at @e[type=minecraft:item_frame,tag=back.dimension] run forceload remove ~ ~
kill @e[type=minecraft:item_frame,tag=back.dimension]
data remove storage back:storage players
data remove storage back:storage lastDimension
data remove storage back:storage temp
scoreboard objectives remove back
scoreboard objectives remove back.config
scoreboard objectives remove back.dummy
scoreboard objectives remove back.delay
scoreboard objectives remove back.deaths
scoreboard objectives remove back.x
scoreboard objectives remove back.y
scoreboard objectives remove back.z
schedule clear back:tick
schedule clear back:check_game_rules