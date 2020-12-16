execute if score @s chunkPre.config < #length chunkPre.config at @s run function chunk_pregenerator:propagate_edge_marker
execute unless score #length chunkPre.config matches 1 if score @s chunkPre.config = #length chunkPre.config at @s run function chunk_pregenerator:propagate_not_edge_marker_from_edge
function chunk_pregenerator:remove_marker