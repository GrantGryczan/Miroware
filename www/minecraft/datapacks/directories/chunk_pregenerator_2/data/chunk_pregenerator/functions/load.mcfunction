scoreboard objectives add chunkPre.config dummy "Chunk Pre-Generator Config"
scoreboard players set #2 chunkPre.config 2
scoreboard players set #chunkLength chunkPre.config 16
scoreboard players set #100 chunkPre.config 100
execute unless score #radius chunkPre.config matches 0..9999 run scoreboard players set #radius chunkPre.config 128
bossbar add chunk_pregenerator:progress "Chunk Pre-Generator Progress"
bossbar set chunk_pregenerator:progress visible true
bossbar set chunk_pregenerator:progress players