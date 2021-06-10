scoreboard players set @s chunkPre.config 1
bossbar set chunk_pregenerator:progress value 1
scoreboard players set #percent chunkPre.config 100
scoreboard players operation #percent chunkPre.config /= #area chunkPre.config
bossbar set chunk_pregenerator:progress name ["Pre-generating chunks... 1 of ",{"score":{"name":"#area","objective":"chunkPre.config"}}," (",{"score":{"name":"#percent","objective":"chunkPre.config"}},"%)"]
function chunk_pregenerator:propagate