function load {
	scoreboard objectives add back trigger "Back"
	scoreboard objectives add back.config dummy "Back Config"
	scoreboard objectives add back.dummy dummy
	scoreboard objectives add back.delay dummy
	scoreboard objectives add back.deaths deathCount
	scoreboard objectives add back.x dummy
	scoreboard objectives add back.y dummy
	scoreboard objectives add back.z dummy
	execute unless score #delay back.config matches 0.. run scoreboard players set #delay back.config 0
	execute unless score #death back.config matches 0..1 run scoreboard players set #death back.config 0
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
	execute at @e[type=minecraft:item_frame,tag=back.dimension] run forceload remove ~ ~
	kill @e[type=minecraft:item_frame,tag=back.dimension]
	data remove storage back:storage players
	data remove storage back:storage lastDimension
	data remove storage back:storage temp
	scoreboard objectives remove back
	scoreboard objectives remove back.config
	scoreboard objectives remove back.dummy
	scoreboard objectives remove back.delay
	scoreboard objectives remove back.deaths
	scoreboard objectives remove back.x
	scoreboard objectives remove back.y
	scoreboard objectives remove back.z
	schedule clear back:tick
	schedule clear back:check_game_rules
}
clock 1t {
	name tick
	scoreboard players enable @a back
	execute as @a[scores={back=1..}] at @s run {
		name trigger_back
		function back:rotate/players
		execute store success score #success back.dummy run data get storage back:storage players[-1].back
		execute if score #success back.dummy matches 0 run tellraw @s [{"text":"You have nowhere to go back to.","color":"red"}]
		execute unless score #success back.dummy matches 0 run {
			name start_to_go_back
			scoreboard players operation @s back.delay = #delay back.config
			execute store result score @s back.x run data get entity @s Pos[0] 10
			execute store result score @s back.y run data get entity @s Pos[1] 10
			execute store result score @s back.z run data get entity @s Pos[2] 10
			tellraw @s [{"text":"Teleporting back...","color":"dark_aqua"}]
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
				execute store success score #success back.dummy run data get storage back:storage players[-1].back
				execute if score #success back.dummy matches 0 run tellraw @s [{"text":"You have nowhere to go back to.","color":"red"}]
				execute unless score #success back.dummy matches 0 run {
					name go_back
					execute store result score #dimension back.dummy run data get storage back:storage players[-1].back.dim
					execute as @e[type=minecraft:item_frame,tag=back.dimension] run {
						name try_to_summon_destination
						execute store result score #id back.dummy run data get entity @s Item.tag.backData.id
						execute if score #id back.dummy = #dimension back.dummy at @s run summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["back.destination"]}
					}
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
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/scoreboard players set #delay back.config <number>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #delay back.config "},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/scoreboard players set #delay back.config","color":"aqua"},{"text":".\nEnter the number after clicking.","color":"dark_aqua"}]}},{"text":" to set the number of ticks for which the player must stand still before teleporting after running the back command. (1 second = 20 ticks.) The default is ","color":"dark_aqua"},{"text":"0","color":"aqua","clickEvent":{"action":"run_command","value":"/scoreboard players set #delay back.config 0"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/scoreboard players set #delay back.config 0","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":". The current value is ","color":"dark_aqua"},{"score":{"name":"#delay","objective":"back.config"},"color":"aqua"},{"text":".","color":"dark_aqua"}]
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/scoreboard players set #death back.config <0 or 1>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #death back.config "},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/scoreboard players set #death back.config","color":"aqua"},{"text":".\nEnter 0 or 1 after clicking.","color":"dark_aqua"}]}},{"text":" to (0) disable or (1) enable saving your death location in the back command. The default is ","color":"dark_aqua"},{"text":"0","color":"aqua","clickEvent":{"action":"run_command","value":"/scoreboard players set #death back.config 0"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/scoreboard players set #death back.config 0","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":". The current value is ","color":"dark_aqua"},{"score":{"name":"#death","objective":"back.config"},"color":"aqua"},{"text":".","color":"dark_aqua"}]
}
