scoreboard players set #steps chunkPre.config -1
execute store success score #success chunkPre.config run forceload add ~ ~
execute if score #success chunkPre.config matches 1 run summon minecraft:area_effect_cloud ~ 0 ~ {Tags:["chunkPre.marker","chunkPre.edge"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
execute unless score #success chunkPre.config matches 1 run summon minecraft:area_effect_cloud ~ 0 ~ {Tags:["chunkPre.marker","chunkPre.edge","chunkPre.alreadyLoaded"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
execute positioned ~ 0 ~ run scoreboard players set @e[type=minecraft:area_effect_cloud,tag=chunkPre.edge,distance=..0.01,limit=1] chunkPre.config 1
scoreboard players set #done chunkPre.config 1
bossbar set chunk_pregenerator:progress value 1
scoreboard players set #percent chunkPre.config 100
scoreboard players operation #percent chunkPre.config /= #area chunkPre.config
bossbar set chunk_pregenerator:progress name ["Pre-generating chunks... 1 of ",{"score":{"name":"#area","objective":"chunkPre.config"}}," (",{"score":{"name":"#percent","objective":"chunkPre.config"}},"%)"]
function chunk_pregenerator:propagate