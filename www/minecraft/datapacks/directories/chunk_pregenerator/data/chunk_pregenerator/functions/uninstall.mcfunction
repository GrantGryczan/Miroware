scoreboard objectives remove chunkPre.config
bossbar remove chunk_pregenerator:progress
schedule clear chunk_pregenerator:propagate
schedule clear chunk_pregenerator:stop
execute as @e[type=minecraft:marker,tag=chunkPre.marker] run function chunk_pregenerator:remove_marker