scoreboard players set #steps chunkPre.config -1
scoreboard players set #done chunkPre.config 1
execute store success score #success chunkPre.config run forceload add ~ ~
execute if score #success chunkPre.config matches 1 run summon minecraft:marker ~ 0 ~ {Tags:["chunkPre.marker","chunkPre.edge"]}
execute unless score #success chunkPre.config matches 1 run summon minecraft:marker ~ 0 ~ {Tags:["chunkPre.marker","chunkPre.edge","chunkPre.alreadyLoaded"]}
schedule function chunk_pregenerator:initiate 3t replace