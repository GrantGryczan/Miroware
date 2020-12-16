execute unless score #done chunkPre.config matches 0.. run tellraw @s {"text":"There is currently no chunk pre-generation to stop.","color":"red"}
execute if score #done chunkPre.config matches 0.. run function chunk_pregenerator:really_stop
execute store result score #sendCommandFeedback chunkPre.config run gamerule sendCommandFeedback
execute if score #sendCommandFeedback chunkPre.config matches 1 run function chunk_pregenerator:hide_command_feedback