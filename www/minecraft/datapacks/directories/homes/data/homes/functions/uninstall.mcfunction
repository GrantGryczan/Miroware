schedule clear homes:tick
schedule clear homes:decrement_cooldowns
execute at @e[type=minecraft:item_frame,tag=homes.dimension] run forceload remove ~ ~
kill @e[type=minecraft:item_frame,tag=homes.dimension]
data remove storage homes:storage players
data remove storage homes:storage lastDimension
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