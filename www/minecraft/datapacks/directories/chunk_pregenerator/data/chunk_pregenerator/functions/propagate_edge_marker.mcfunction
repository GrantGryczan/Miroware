execute store success score #success chunkPre.config run forceload add ~16 ~
execute if score #success chunkPre.config matches 1 run summon minecraft:area_effect_cloud ~16 0 ~ {Tags:["chunkPre.marker","chunkPre.edge"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
execute unless score #success chunkPre.config matches 1 run summon minecraft:area_effect_cloud ~16 0 ~ {Tags:["chunkPre.marker","chunkPre.edge","chunkPre.alreadyLoaded"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
execute positioned ~16 0 ~ run function chunk_pregenerator:configure_edge_marker
function chunk_pregenerator:propagate_not_edge_marker_from_edge