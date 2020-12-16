tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
tellraw @s ["             Chunk Pre-Generator",{"text":" / ","color":"gray"},"Setup (Continued)             "]
tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
execute unless score #radius chunkPre.config matches 0..9999 run scoreboard players set #radius chunkPre.config 128
scoreboard players operation #blockRadius chunkPre.config = #radius chunkPre.config
scoreboard players operation #blockRadius chunkPre.config *= #chunkLength chunkPre.config
scoreboard players operation #length chunkPre.config = #radius chunkPre.config
scoreboard players operation #length chunkPre.config *= #2 chunkPre.config
scoreboard players add #length chunkPre.config 1
scoreboard players operation #blockLength chunkPre.config = #length chunkPre.config
scoreboard players operation #blockLength chunkPre.config *= #chunkLength chunkPre.config
scoreboard players operation #area chunkPre.config = #length chunkPre.config
scoreboard players operation #area chunkPre.config *= #area chunkPre.config
tellraw @s "Radius"
tellraw @s [{"text":" = ","color":"gray"},{"score":{"name":"#radius","objective":"chunkPre.config"},"color":"gray"},{"text":" chunks","color":"gray"}]
tellraw @s [{"text":" = ","color":"gray"},{"score":{"name":"#blockRadius","objective":"chunkPre.config"},"color":"gray"},{"text":" blocks","color":"gray"}]
tellraw @s "Dimensions"
tellraw @s [{"text":" = ","color":"gray"},{"score":{"name":"#length","objective":"chunkPre.config"},"color":"gray"},{"text":" x ","color":"gray"},{"score":{"name":"#length","objective":"chunkPre.config"},"color":"gray"},{"text":" chunks"}]
tellraw @s [{"text":" = ","color":"gray"},{"score":{"name":"#blockLength","objective":"chunkPre.config"},"color":"gray"},{"text":" x ","color":"gray"},{"score":{"name":"#blockLength","objective":"chunkPre.config"},"color":"gray"},{"text":" blocks","color":"gray"}]
tellraw @s "Area"
tellraw @s [{"text":" = ","color":"gray"},{"score":{"name":"#area","objective":"chunkPre.config"},"color":"gray"},{"text":" chunks","color":"gray"}]
tellraw @s "\nThe pre-generated chunk area will be centered around your current player position."
tellraw @s ["\n                  ",{"text":"[ Cancel ]","clickEvent":{"action":"run_command","value":"/function chunk_pregenerator:setup"},"hoverEvent":{"action":"show_text","value":{"text":"Click to edit the setup configuration again.","color":"gray"}},"color":"red"},"                  ",{"text":"[ Confirm ]","clickEvent":{"action":"run_command","value":"/function chunk_pregenerator:confirm"},"hoverEvent":{"action":"show_text","value":{"text":"Click to start pre-generating chunks with the current configuration above.","color":"gray"}},"color":"green"},"                  "]
tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
execute store result score #sendCommandFeedback chunkPre.config run gamerule sendCommandFeedback
execute if score #sendCommandFeedback chunkPre.config matches 1 run function chunk_pregenerator:hide_command_feedback