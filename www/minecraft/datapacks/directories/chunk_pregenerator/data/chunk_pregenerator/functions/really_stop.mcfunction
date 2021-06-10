schedule clear chunk_pregenerator:propagate
schedule clear chunk_pregenerator:stop
bossbar set chunk_pregenerator:progress players
execute as @e[type=minecraft:marker,tag=chunkPre.marker] run function chunk_pregenerator:remove_marker
tellraw @s [{"text":"Chunk pre-generation cancelled at ","color":"red"},{"score":{"name":"#done","objective":"chunkPre.config"},"color":"red"},{"text":" of ","color":"red"},{"score":{"name":"#area","objective":"chunkPre.config"},"color":"red"},{"text":" (","color":"red"},{"score":{"name":"#percent","objective":"chunkPre.config"},"color":"red"},{"text":"%) completion.","color":"red"}]
execute unless entity @s run function chunk_pregenerator:announce_stop
scoreboard players set #done chunkPre.config -1