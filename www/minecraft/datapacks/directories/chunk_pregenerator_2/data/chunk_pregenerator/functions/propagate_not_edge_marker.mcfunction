execute store success score #success chunkPre.config run forceload add ~ ~16
execute if score #success chunkPre.config matches 1 run summon minecraft:area_effect_cloud ~ 0 ~16 {Tags:["chunkPre.marker","chunkPre.notEdge"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
execute unless score #success chunkPre.config matches 1 run summon minecraft:area_effect_cloud ~ 0 ~16 {Tags:["chunkPre.marker","chunkPre.notEdge","chunkPre.alreadyLoaded"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
execute positioned ~ 0 ~16 run function chunk_pregenerator:configure_not_edge_marker