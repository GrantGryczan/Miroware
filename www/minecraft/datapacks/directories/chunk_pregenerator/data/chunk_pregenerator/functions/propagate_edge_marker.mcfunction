execute store success score #success chunkPre.config run forceload add ~16 ~
execute if score #success chunkPre.config matches 1 run summon minecraft:marker ~16 0 ~ {Tags:["chunkPre.marker","chunkPre.edge"]}
execute unless score #success chunkPre.config matches 1 run summon minecraft:marker ~16 0 ~ {Tags:["chunkPre.marker","chunkPre.edge","chunkPre.alreadyLoaded"]}
execute positioned ~16 0 ~ run function chunk_pregenerator:configure_edge_marker
function chunk_pregenerator:propagate_not_edge_marker_from_edge