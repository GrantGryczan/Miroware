execute if score #done chunkPre.config matches 0.. run function chunk_pregenerator:really_stop
tellraw @s [{"text":"Pre-generating chunks... Enter ","color":"gold"},{"text":"/function chunk_pregenerator:stop","color":"yellow"},{"text":" to cancel.","color":"gold"}]
execute unless score #radius chunkPre.config matches 0..9999 run scoreboard players set #radius chunkPre.config 64
scoreboard players operation #length chunkPre.config = #radius chunkPre.config
scoreboard players operation #length chunkPre.config *= #2 chunkPre.config
scoreboard players add #length chunkPre.config 1
scoreboard players operation #area chunkPre.config = #length chunkPre.config
execute store result bossbar chunk_pregenerator:progress max run scoreboard players operation #area chunkPre.config *= #area chunkPre.config
scoreboard players set #steps chunkPre.config -1
function chunk_pregenerator:find_corner
execute store result score #sendCommandFeedback chunkPre.config run gamerule sendCommandFeedback
execute if score #sendCommandFeedback chunkPre.config matches 1 run function chunk_pregenerator:hide_command_feedback