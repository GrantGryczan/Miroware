bossbar set chunk_pregenerator:progress players @a
execute as @e[type=minecraft:area_effect_cloud,tag=chunkPre.edge,limit=256] run function chunk_pregenerator:check_edge_marker
execute as @e[type=minecraft:area_effect_cloud,tag=chunkPre.notEdge,limit=256] run function chunk_pregenerator:check_not_edge_marker
execute if score #done chunkPre.config = #area chunkPre.config run schedule function chunk_pregenerator:really_stop 1t
execute unless score #done chunkPre.config = #area chunkPre.config run schedule function chunk_pregenerator:propagate 1t