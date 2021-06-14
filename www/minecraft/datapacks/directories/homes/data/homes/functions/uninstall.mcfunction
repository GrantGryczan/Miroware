schedule clear homes:tick
schedule clear homes:decrement_cooldowns
schedule clear homes:try_to_mark_dimension
execute as @e[type=minecraft:marker,tag=homes.dimension] at @s run function homes:remove_dimension_marker
data remove storage homes:storage players
data remove storage homes:storage temp
data remove storage homes:storage temp2
scoreboard objectives remove sethome
scoreboard objectives remove homes
scoreboard objectives remove home
scoreboard objectives remove namehome
scoreboard objectives remove delhome
scoreboard objectives remove homes.target
scoreboard objectives remove homes.delay
scoreboard objectives remove homes.cooldown
scoreboard objectives remove homes.dummy
scoreboard objectives remove homes.config
scoreboard objectives remove homes.x
scoreboard objectives remove homes.y
scoreboard objectives remove homes.z