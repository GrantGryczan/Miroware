scoreboard players operation @e[type=minecraft:marker,tag=chunkPre.edge,distance=..0.01,limit=1] chunkPre.config = @s chunkPre.config
scoreboard players add @e[type=minecraft:marker,tag=chunkPre.edge,distance=..0.01,limit=1] chunkPre.config 1
tellraw @a [{"score":{"name":"@s","objective":"chunkPre.config"}}]
execute store result bossbar chunk_pregenerator:progress value run scoreboard players add #done chunkPre.config 1
scoreboard players operation #percent chunkPre.config = #done chunkPre.config
scoreboard players operation #percent chunkPre.config *= #100 chunkPre.config
scoreboard players operation #percent chunkPre.config /= #area chunkPre.config
bossbar set chunk_pregenerator:progress name ["Pre-generating chunks... ",{"score":{"name":"#done","objective":"chunkPre.config"}}," of ",{"score":{"name":"#area","objective":"chunkPre.config"}}," (",{"score":{"name":"#percent","objective":"chunkPre.config"}},"%)"]