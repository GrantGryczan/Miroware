execute store success score #success chunkPre.config run forceload add ~ ~16
execute if score #success chunkPre.config matches 1 run summon minecraft:marker ~ 0 ~16 {Tags:["chunkPre.marker","chunkPre.notEdge"]}
execute unless score #success chunkPre.config matches 1 run summon minecraft:marker ~ 0 ~16 {Tags:["chunkPre.marker","chunkPre.notEdge","chunkPre.alreadyLoaded"]}
execute positioned ~ 0 ~16 run function chunk_pregenerator:configure_not_edge_marker