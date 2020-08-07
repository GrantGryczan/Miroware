scoreboard objectives add mulSle.config trigger "Multiplayer Sleep Config"
scoreboard objectives add mulSle trigger "Multiplayer Sleep"
scoreboard objectives add mulSle.dummy dummy
scoreboard objectives add mulSle.sleepTime dummy
scoreboard players set #total mulSle.config 100
execute unless score #percent mulSle.config matches 0..100 run scoreboard players set #percent mulSle.config 0
execute unless score #display mulSle.config matches 1..3 run scoreboard players set #display mulSle.config 1
bossbar add multiplayer_sleep:progress "Multiplayer Sleep Progress"
bossbar add multiplayer_sleep:preview "Multiplayer Sleep Progress"
bossbar set multiplayer_sleep:preview name "1 of 2 player(s) asleep"
bossbar set multiplayer_sleep:preview visible true
bossbar set multiplayer_sleep:preview value 1
bossbar set multiplayer_sleep:preview max 2
bossbar set multiplayer_sleep:preview players