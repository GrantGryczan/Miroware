function load {
	scoreboard objectives add chunkPre.config dummy "Chunk Pre-Generator Config"
	scoreboard players set #2 chunkPre.config 2
	scoreboard players set #chunkLength chunkPre.config 16
	scoreboard players set #100 chunkPre.config 100
	execute unless score #radius chunkPre.config matches 0..9999 run scoreboard players set #radius chunkPre.config 128
	bossbar add chunk_pregenerator:progress "Chunk Pre-Generator Progress"
	bossbar set chunk_pregenerator:progress visible true
	bossbar set chunk_pregenerator:progress players
}
function uninstall {
	scoreboard objectives remove chunkPre.config
	bossbar remove chunk_pregenerator:progress
	schedule clear chunk_pregenerator:propagate
	schedule clear chunk_pregenerator:stop
	execute as @e[type=minecraft:area_effect_cloud,tag=chunkPre.marker] run function chunk_pregenerator:remove_marker
}
function setup {
	execute if score #done chunkPre.config matches 0.. run function chunk_pregenerator:really_stop
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	tellraw @s ["                     Chunk Pre-Generator",{"text":" / ","color":"gray"},"Setup                     "]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #radius chunkPre.config "},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enter the chunk radius of the square area in which the chunks will be pre-generated.\n","color":"gray"},"0",{"text":" = 1 x 1 = 1 chunk\n","color":"gray"},"1",{"text":" = 3 x 3 = 9 chunks\n","color":"gray"},"2",{"text":" = 5 x 5 = 25 chunks\netc.","color":"gray"},{"text":"\nAccepts: whole numbers 0-9999\nDefault: 128 = 257 x 257 = 66049 chunks","color":"dark_gray"}]}}," Radius ",{"text":"(Current: ","color":"gray"},{"score":{"name":"#radius","objective":"chunkPre.config"},"color":"gray"},{"text":")","color":"gray"}]
	tellraw @s ["\n                                ",{"text":"[ Continue ]","clickEvent":{"action":"run_command","value":"/function chunk_pregenerator:continue"},"hoverEvent":{"action":"show_text","value":{"text":"Click to continue setup with the current configuration.","color":"gray"}},"color":"gold"},"                                "]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	execute store result score #sendCommandFeedback chunkPre.config run gamerule sendCommandFeedback
	execute if score #sendCommandFeedback chunkPre.config matches 1 run {
		name hide_command_feedback
		gamerule sendCommandFeedback false
		schedule 1t replace {
			name restore_command_feedback
			gamerule sendCommandFeedback true
		}
	}
}
function continue {
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
}
function confirm {
	execute if score #done chunkPre.config matches 0.. run function chunk_pregenerator:really_stop
	tellraw @s [{"text":"Pre-generating chunks... Enter ","color":"gold"},{"text":"/function chunk_pregenerator:stop","color":"yellow"},{"text":" to cancel.","color":"gold"}]
	execute unless score #radius chunkPre.config matches 0..9999 run scoreboard players set #radius chunkPre.config 64
	scoreboard players operation #length chunkPre.config = #radius chunkPre.config
	scoreboard players operation #length chunkPre.config *= #2 chunkPre.config
	scoreboard players add #length chunkPre.config 1
	scoreboard players operation #area chunkPre.config = #length chunkPre.config
	execute store result bossbar chunk_pregenerator:progress max run scoreboard players operation #area chunkPre.config *= #area chunkPre.config
	scoreboard players set #steps chunkPre.config -1
	block {
		name find_corner
		scoreboard players add #steps chunkPre.config 1
		execute unless score #steps chunkPre.config = #radius chunkPre.config positioned ~-16 0 ~-16 run function $block
		execute if score #steps chunkPre.config = #radius chunkPre.config run {
			name load_corner
			scoreboard players set #steps chunkPre.config -1
			execute store success score #success chunkPre.config run forceload add ~ ~
			execute if score #success chunkPre.config matches 1 run summon minecraft:area_effect_cloud ~ 0 ~ {Tags:["chunkPre.marker","chunkPre.edge"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
			execute unless score #success chunkPre.config matches 1 run summon minecraft:area_effect_cloud ~ 0 ~ {Tags:["chunkPre.marker","chunkPre.edge","chunkPre.alreadyLoaded"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
			execute positioned ~ 0 ~ run scoreboard players set @e[type=minecraft:area_effect_cloud,tag=chunkPre.edge,distance=..0.01,limit=1] chunkPre.config 1
			scoreboard players set #done chunkPre.config 1
			bossbar set chunk_pregenerator:progress value 1
			scoreboard players set #percent chunkPre.config 100
			scoreboard players operation #percent chunkPre.config /= #area chunkPre.config
			bossbar set chunk_pregenerator:progress name ["Pre-generating chunks... 1 of ",{"score":{"name":"#area","objective":"chunkPre.config"}}," (",{"score":{"name":"#percent","objective":"chunkPre.config"}},"%)"]
			block {
				name propagate
				bossbar set chunk_pregenerator:progress players @a
				execute as @e[type=minecraft:area_effect_cloud,tag=chunkPre.edge,limit=256] run {
					name check_edge_marker
					execute if score @s chunkPre.config < #length chunkPre.config at @s run {
						name propagate_edge_marker
						execute store success score #success chunkPre.config run forceload add ~16 ~
						execute if score #success chunkPre.config matches 1 run summon minecraft:area_effect_cloud ~16 0 ~ {Tags:["chunkPre.marker","chunkPre.edge"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
						execute unless score #success chunkPre.config matches 1 run summon minecraft:area_effect_cloud ~16 0 ~ {Tags:["chunkPre.marker","chunkPre.edge","chunkPre.alreadyLoaded"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
						execute positioned ~16 0 ~ run {
							name configure_edge_marker
							scoreboard players operation @e[type=minecraft:area_effect_cloud,tag=chunkPre.edge,distance=..0.01,limit=1] chunkPre.config = @s chunkPre.config
							scoreboard players add @e[type=minecraft:area_effect_cloud,tag=chunkPre.edge,distance=..0.01,limit=1] chunkPre.config 1
							execute store result bossbar chunk_pregenerator:progress value run scoreboard players add #done chunkPre.config 1
							scoreboard players operation #percent chunkPre.config = #done chunkPre.config
							scoreboard players operation #percent chunkPre.config *= #100 chunkPre.config
							scoreboard players operation #percent chunkPre.config /= #area chunkPre.config
							bossbar set chunk_pregenerator:progress name ["Pre-generating chunks... ",{"score":{"name":"#done","objective":"chunkPre.config"}}," of ",{"score":{"name":"#area","objective":"chunkPre.config"}}," (",{"score":{"name":"#percent","objective":"chunkPre.config"}},"%)"]
						}
						function chunk_pregenerator:propagate_not_edge_marker_from_edge
					}
					execute unless score #length chunkPre.config matches 1 if score @s chunkPre.config = #length chunkPre.config at @s run {
						name propagate_not_edge_marker_from_edge
						execute store success score #success chunkPre.config run forceload add ~ ~16
						execute if score #success chunkPre.config matches 1 run summon minecraft:area_effect_cloud ~ 0 ~16 {Tags:["chunkPre.marker","chunkPre.notEdge"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
						execute unless score #success chunkPre.config matches 1 run summon minecraft:area_effect_cloud ~ 0 ~16 {Tags:["chunkPre.marker","chunkPre.notEdge","chunkPre.alreadyLoaded"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
						execute positioned ~ 0 ~16 run {
							name configure_not_edge_marker_from_edge
							scoreboard players set @e[type=minecraft:area_effect_cloud,tag=chunkPre.notEdge,distance=..0.01,limit=1] chunkPre.config 2
							execute store result bossbar chunk_pregenerator:progress value run scoreboard players add #done chunkPre.config 1
							scoreboard players operation #percent chunkPre.config = #done chunkPre.config
							scoreboard players operation #percent chunkPre.config *= #100 chunkPre.config
							scoreboard players operation #percent chunkPre.config /= #area chunkPre.config
							bossbar set chunk_pregenerator:progress name ["Pre-generating chunks... ",{"score":{"name":"#done","objective":"chunkPre.config"}}," of ",{"score":{"name":"#area","objective":"chunkPre.config"}}," (",{"score":{"name":"#percent","objective":"chunkPre.config"}},"%)"]
						}
					}
					function chunk_pregenerator:remove_marker
				}
				execute as @e[type=minecraft:area_effect_cloud,tag=chunkPre.notEdge,limit=256] run {
					name check_not_edge_marker
					execute if score @s chunkPre.config < #length chunkPre.config at @s run {
						name propagate_not_edge_marker
						execute store success score #success chunkPre.config run forceload add ~ ~16
						execute if score #success chunkPre.config matches 1 run summon minecraft:area_effect_cloud ~ 0 ~16 {Tags:["chunkPre.marker","chunkPre.notEdge"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
						execute unless score #success chunkPre.config matches 1 run summon minecraft:area_effect_cloud ~ 0 ~16 {Tags:["chunkPre.marker","chunkPre.notEdge","chunkPre.alreadyLoaded"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
						execute positioned ~ 0 ~16 run {
							name configure_not_edge_marker
							scoreboard players operation @e[type=minecraft:area_effect_cloud,tag=chunkPre.notEdge,distance=..0.01,limit=1] chunkPre.config = @s chunkPre.config
							scoreboard players add @e[type=minecraft:area_effect_cloud,tag=chunkPre.notEdge,distance=..0.01,limit=1] chunkPre.config 1
							execute store result bossbar chunk_pregenerator:progress value run scoreboard players add #done chunkPre.config 1
							scoreboard players operation #percent chunkPre.config = #done chunkPre.config
							scoreboard players operation #percent chunkPre.config *= #100 chunkPre.config
							scoreboard players operation #percent chunkPre.config /= #area chunkPre.config
							bossbar set chunk_pregenerator:progress name ["Pre-generating chunks... ",{"score":{"name":"#done","objective":"chunkPre.config"}}," of ",{"score":{"name":"#area","objective":"chunkPre.config"}}," (",{"score":{"name":"#percent","objective":"chunkPre.config"}},"%)"]
						}
					}
					function chunk_pregenerator:remove_marker
				}
				execute if score #done chunkPre.config = #area chunkPre.config run schedule function chunk_pregenerator:really_stop 1t
				execute unless score #done chunkPre.config = #area chunkPre.config run schedule function $block 1t
			}
		}
	}
	execute store result score #sendCommandFeedback chunkPre.config run gamerule sendCommandFeedback
	execute if score #sendCommandFeedback chunkPre.config matches 1 run function chunk_pregenerator:hide_command_feedback
}
function stop {
	execute unless score #done chunkPre.config matches 0.. run tellraw @s {"text":"There is currently no chunk pre-generation to stop.","color":"red"}
	execute if score #done chunkPre.config matches 0.. run {
		name really_stop
		schedule clear chunk_pregenerator:propagate
		schedule clear chunk_pregenerator:stop
		bossbar set chunk_pregenerator:progress players
		execute as @e[type=minecraft:area_effect_cloud,tag=chunkPre.marker] run {
			name remove_marker
			execute unless entity @s[tag=chunkPre.alreadyLoaded] at @s run forceload remove ~ ~
			kill @s
		}
		tellraw @s [{"text":"Chunk pre-generation cancelled at ","color":"red"},{"score":{"name":"#done","objective":"chunkPre.config"},"color":"red"},{"text":" of ","color":"red"},{"score":{"name":"#area","objective":"chunkPre.config"},"color":"red"},{"text":" (","color":"red"},{"score":{"name":"#percent","objective":"chunkPre.config"},"color":"red"},{"text":"%) completion.","color":"red"}]
		execute unless entity @s run {
			name announce_stop
			tellraw @a {"text":"Chunks pre-generated!","color":"gold"}
			tellraw @a {"text":"If this is a multiplayer world, it is recommended that you restart the server to clear lag from the pre-generation.","color":"gold"}
			tellraw @a {"text":"If this is a singleplayer world, it is recommended that you leave and rejoin to clear lag from the pre-generation.","color":"gold"}
			execute unless entity @a run {
				name log_completion
				say Chunks pre-generated!
				say It is recommended that you restart the server to clear lag from the pre-generation.
			}
		}
		scoreboard players set #done chunkPre.config -1
	}
	execute store result score #sendCommandFeedback chunkPre.config run gamerule sendCommandFeedback
	execute if score #sendCommandFeedback chunkPre.config matches 1 run function chunk_pregenerator:hide_command_feedback
}
