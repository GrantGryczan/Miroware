scoreboard players add #steps chunkPre.config 1
execute unless score #steps chunkPre.config = #radius chunkPre.config positioned ~-16 0 ~-16 run function chunk_pregenerator:find_corner
execute unless score #steps chunkPre.config matches -1 run function chunk_pregenerator:load_corner