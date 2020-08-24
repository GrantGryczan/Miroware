function load {
	scoreboard objectives add back trigger "Back"
	scoreboard objectives add back.config dummy "Back Config"
	scoreboard objectives add back.dummy dummy
	scoreboard objectives add back.delay dummy
	scoreboard objectives add back.cooldown dummy
	scoreboard objectives add back.deaths deathCount
	scoreboard objectives add back.x dummy
	scoreboard objectives add back.y dummy
	scoreboard objectives add back.z dummy
	execute unless score #death back.config matches 0..1 run scoreboard players set #death back.config 0
	execute unless score #delay back.config matches 0.. run scoreboard players set #delay back.config 0
	execute unless score #cooldown spawn.config matches 0.. run scoreboard players set #cooldown spawn.config 0
	execute in minecraft:overworld store result score #prevOverworldDoImmediateRespawn back.dummy run gamerule doImmediateRespawn
	execute in minecraft:the_nether store result score #prevNetherDoImmediateRespawn back.dummy run gamerule doImmediateRespawn
	execute in minecraft:overworld run gamerule doImmediateRespawn true
	execute in minecraft:the_nether run gamerule doImmediateRespawn false
	execute in minecraft:overworld store result score #dimGameRules back.dummy run gamerule doImmediateRespawn
	execute if score #prevOverworldDoImmediateRespawn back.dummy matches 0 in minecraft:overworld run gamerule doImmediateRespawn false
	execute if score #prevOverworldDoImmediateRespawn back.dummy matches 1 in minecraft:overworld run gamerule doImmediateRespawn true
	execute if score #prevNetherDoImmediateRespawn back.dummy matches 1 in minecraft:the_nether run gamerule doImmediateRespawn true
	scoreboard players set #prevOverworldDoImmediateRespawn back.dummy 0
	scoreboard players set #prevNetherDoImmediateRespawn back.dummy 0
	scoreboard players set #prevEndDoImmediateRespawn back.dummy 0
	scoreboard players reset * back.deaths
}
function uninstall {
	schedule clear back:tick
	schedule clear back:decrement_cooldowns
	schedule clear back:check_game_rules
	execute at @e[type=minecraft:item_frame,tag=back.dimension] run forceload remove ~ ~
	kill @e[type=minecraft:item_frame,tag=back.dimension]
	data remove storage back:storage players
	data remove storage back:storage lastDimension
	data remove storage back:storage temp
	scoreboard objectives remove back
	scoreboard objectives remove back.config
	scoreboard objectives remove back.dummy
	scoreboard objectives remove back.delay
	scoreboard objectives remove back.cooldown
	scoreboard objectives remove back.deaths
	scoreboard objectives remove back.x
	scoreboard objectives remove back.y
	scoreboard objectives remove back.z
}
clock 1t {
	name tick
	scoreboard players enable @a back
	execute as @a[scores={back=1..}] at @s run {
		name trigger_back
		execute if score @s back.cooldown matches 1.. run tellraw @s [{"text":"Your Back cooldown will end in ","color":"red"},{"score":{"name":"@s","objective":"back.cooldown"},"color":"red"},{"text":" seconds.","color":"red"}]
		execute unless score @s back.cooldown matches 1.. run {
			name try_to_start_to_go_back
			function back:rotate/players
			execute store success score #success back.dummy if data storage back:storage players[-1].back
			execute if score #success back.dummy matches 0 run tellraw @s [{"text":"You have nowhere to go back to.","color":"red"}]
			execute unless score #success back.dummy matches 0 run {
				name start_to_go_back
				scoreboard players operation @s back.delay = #delay back.config
				execute store result score @s back.x run data get entity @s Pos[0] 10
				execute store result score @s back.y run data get entity @s Pos[1] 10
				execute store result score @s back.z run data get entity @s Pos[2] 10
				tellraw @s [{"text":"Teleporting back...","color":"dark_aqua"}]
			}
		}
		scoreboard players set @s back 0
	}
	execute as @a[scores={back.delay=0..}] run {
		name try_to_try_to_try_to_go_back
		execute if score @s back.delay matches 0 run {
			name try_to_try_to_go_back
			function back:rotate/players
			scoreboard players set #success back.dummy 0
			execute store result score #value back.dummy run data get entity @s Pos[1] 10
			execute if score #value back.dummy = @s back.y run {
				name check_x
				execute store result score #value back.dummy run data get entity @s Pos[0] 10
				execute if score #value back.dummy = @s back.x run {
					name check_z
					execute store result score #value back.dummy run data get entity @s Pos[2] 10
					execute store success score #success back.dummy if score #value back.dummy = @s back.z
				}
			}
			scoreboard players reset @s back.x
			scoreboard players reset @s back.y
			scoreboard players reset @s back.z
			execute if score #success back.dummy matches 0 run tellraw @s [{"text":"You must stand still to teleport.","color":"red"}]
			execute unless score #success back.dummy matches 0 run {
				name try_to_go_back
				execute store success score #success back.dummy if data storage back:storage players[-1].back
				execute if score #success back.dummy matches 0 run tellraw @s [{"text":"You have nowhere to go back to.","color":"red"}]
				execute unless score #success back.dummy matches 0 run {
					name go_back
					execute store result score #dimension back.dummy run data get storage back:storage players[-1].back.dim
					execute as @e[type=minecraft:item_frame,tag=back.dimension] run {
						name try_to_summon_destination
						execute store result score #id back.dummy run data get entity @s Item.tag.backData.id
						execute if score #id back.dummy = #dimension back.dummy at @s run summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["back.destination"]}
					}
					execute unless score #cooldown back.config matches 0 run scoreboard players operation @s back.cooldown = #cooldown back.config
					tag @s add back.subject
					execute as @e[type=minecraft:area_effect_cloud,tag=back.destination] run {
						name set_destination
						data modify entity @s Pos set from storage back:storage players[-1].back.pos
						data modify entity @s Rotation set from storage back:storage players[-1].back.rot
						execute as @a[tag=back.subject] at @s run function back:set_back
						tp @a[tag=back.subject] @s
						kill @s
					}
					tag @s remove back.subject
				}
			}
			scoreboard players reset @s back.delay
		}
		execute unless score @s back.delay matches 0 run scoreboard players remove @s back.delay 1
	}
	execute as @a[scores={back.deaths=1..}] run {
		name death
		execute if score #death back.config matches 1 at @s run function back:set_back
		scoreboard players reset @s back.deaths
	}
}
clock 1s {
	name decrement_cooldowns
	execute as @a[scores={back.cooldown=1..}] run {
		name decrement_cooldown
		scoreboard players remove @s back.cooldown 1
		execute if score @s back.cooldown matches 0 run scoreboard players reset @s back.cooldown
	}
}
clock 5s {
	name check_game_rules
	execute in minecraft:overworld store result score #doImmediateRespawn back.dummy run gamerule doImmediateRespawn
	execute if score #doImmediateRespawn back.dummy matches 1 if score #prevOverworldDoImmediateRespawn back.dummy matches 0 run tellraw @a {"text":"The Back data pack cannot detect your death location correctly unless gamerule doImmediateRespawn is false. You may ignore this message if death location saving is disabled.","color":"red"}
	scoreboard players operation #prevOverworldDoImmediateRespawn back.dummy = #doImmediateRespawn back.dummy
	execute if score #dimGameRules back.dummy matches 1 run {
		name check_dimensional_game_rules
		execute in minecraft:the_nether store result score #doImmediateRespawn back.dummy run gamerule doImmediateRespawn
		execute if score #doImmediateRespawn back.dummy matches 1 if score #prevNetherDoImmediateRespawn back.dummy matches 0 run tellraw @a {"text":"The Back data pack cannot detect your death location correctly unless gamerule doImmediateRespawn is false. You may ignore this message if death location saving is disabled.","color":"red"}
		scoreboard players operation #prevNetherDoImmediateRespawn back.dummy = #doImmediateRespawn back.dummy
		execute in minecraft:the_end store result score #doImmediateRespawn back.dummy run gamerule doImmediateRespawn
		execute if score #doImmediateRespawn back.dummy matches 1 if score #prevEndDoImmediateRespawn back.dummy matches 0 run tellraw @a {"text":"The Back data pack cannot detect your death location correctly unless gamerule doImmediateRespawn is false. You may ignore this message if death location saving is disabled.","color":"red"}
		scoreboard players operation #prevEndDoImmediateRespawn back.dummy = #doImmediateRespawn back.dummy
	}
}
dir rotate {
	function players {
		execute store result score #remaining back.dummy run data get storage back:storage players
		data modify storage back:storage temp set from entity @s UUID
		execute store success score #success back.dummy run data modify storage back:storage temp set from storage back:storage players[-1].uuid
		execute unless score #remaining back.dummy matches 0 if score #success back.dummy matches 1 run function back:rotate/player
		execute if score #remaining back.dummy matches 0 run {
			name add_player
			data modify storage back:storage players append value {}
			data modify storage back:storage players[-1].uuid set from entity @s UUID
		}
	}
	function player {
		data modify storage back:storage players prepend from storage back:storage players[-1]
		data remove storage back:storage players[-1]
		scoreboard players remove #remaining back.dummy 1
		data modify storage back:storage temp set from entity @s UUID
		execute store success score #success back.dummy run data modify storage back:storage temp set from storage back:storage players[-1].uuid
		execute unless score #remaining back.dummy matches 0 if score #success back.dummy matches 1 run function $block
	}
}
function set_back {
	execute unless entity @e[type=minecraft:item_frame,tag=back.dimension,distance=0..] positioned 12940016 1000 17249568 run {
		name summon_dimension_marker
		forceload add ~ ~
		summon minecraft:item_frame ~ ~ ~ {Tags:["back.dimension","back.new"],Fixed:1b,Invisible:1b,Item:{id:"minecraft:stone_button",Count:1b,tag:{backData:{}}}}
		execute store result score #id back.dummy run data get storage back:storage lastDimension
		execute store result entity @e[type=minecraft:item_frame,tag=back.new,limit=1] Item.tag.backData.id int 1 run scoreboard players add #id back.dummy 1
		execute store result storage back:storage lastDimension int 1 run scoreboard players get #id back.dummy
		data modify entity @e[type=minecraft:item_frame,tag=back.new,limit=1] Item.tag.backData.name set from entity @s Dimension
		tag @e[type=minecraft:item_frame] remove back.new
	}
	function back:rotate/players
	data modify storage back:storage players[-1].back.dim set from entity @e[type=minecraft:item_frame,tag=back.dimension,distance=0..,limit=1] Item.tag.backData.id
	data modify storage back:storage players[-1].back.pos set from entity @s Pos
	data modify storage back:storage players[-1].back.rot set from entity @s Rotation
}
function config {
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	tellraw @s ["                          Back",{"text":" / ","color":"gray"},"Global Settings                          "]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	execute if score #death back.config matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function back:config/disable_death"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to disable ","color":"red"},"Save Death Location",{"text":".","color":"red"},{"text":"\nWhen enabled, death locations will be saved in the back command.","color":"gray"},{"text":"\nDefault: Disabled","color":"dark_gray"}]}}," Save Death Location"]
	execute unless score #death back.config matches 1 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function back:config/enable_death"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enable ","color":"green"},"Save Death Location",{"text":".","color":"green"},{"text":"\nWhen enabled, death locations will be saved in the back command.","color":"gray"},{"text":"\nDefault: Disabled","color":"dark_gray"}]}}," Save Death Location"]
	tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #delay back.config "},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enter the number of ticks required to stand still after running the back command.\n1 second = 20 ticks","color":"gray"},{"text":"\nAccepts: whole numbers 0+\nDefault: 0","color":"dark_gray"}]}}," Delay ",{"text":"(Current: ","color":"gray"},{"score":{"name":"#delay","objective":"back.config"},"color":"gray"},{"text":")","color":"gray"}]
	tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #cooldown back.config "},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enter the number of seconds required to wait between uses of the back command.","color":"gray"},{"text":"\nAccepts: whole numbers 0+\nDefault: 0","color":"dark_gray"}]}}," Cooldown ",{"text":"(Current: ","color":"gray"},{"score":{"name":"#cooldown","objective":"back.config"},"color":"gray"},{"text":")","color":"gray"}]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	execute store result score #sendCommandFeedback back.config run gamerule sendCommandFeedback
	execute if score #sendCommandFeedback back.config matches 1 run {
		name hide_command_feedback
		gamerule sendCommandFeedback false
		schedule 1t replace {
			name restore_command_feedback
			gamerule sendCommandFeedback true
		}
	}
}
dir config {
	function enable_death {
		scoreboard players set #death back.config 1
		function back:config
	}
	function disable_death {
		scoreboard players set #death back.config 0
		function back:config
	}
}
