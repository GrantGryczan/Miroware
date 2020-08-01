function load {
	scoreboard objectives add mulSle.config dummy "Multiplayer Sleep Config"
	scoreboard objectives add mulSle trigger "Multiplayer Sleep"
	scoreboard objectives add mulSle.dummy dummy
	scoreboard players set #total mulSle.config 100
	execute unless score #percent mulSle.config matches 0..100 run scoreboard players set #percent mulSle.config 50
	scoreboard players set #bit0 mulSle.dummy 1
	scoreboard players set #bit1 mulSle.dummy 2
	scoreboard players set #bit2 mulSle.dummy 4
	scoreboard players set #bit3 mulSle.dummy 8
	scoreboard players set #bit4 mulSle.dummy 16
	scoreboard players set #bit5 mulSle.dummy 32
	scoreboard players set #bit6 mulSle.dummy 64
	scoreboard players set #bit7 mulSle.dummy 128
	scoreboard players set #bit8 mulSle.dummy 256
	scoreboard players set #bit9 mulSle.dummy 512
	scoreboard players set #bit10 mulSle.dummy 1024
	scoreboard players set #bit11 mulSle.dummy 2048
	scoreboard players set #bit12 mulSle.dummy 4096
	scoreboard players set #bit13 mulSle.dummy 8192
	scoreboard players set #bit14 mulSle.dummy 16384
	bossbar add multiplayer_sleep:progress "Multiplayer Sleep Progress"
}
function uninstall {
	scoreboard objectives remove mulSle.config
	scoreboard objectives remove mulSle
	scoreboard objectives remove mulSle.dummy
	bossbar remove multiplayer_sleep:progress
	schedule clear multiplayer_sleep:tick
}
clock 1t {
	name tick
	scoreboard players enable @a mulSle
	execute as @a[scores={mulSle=1}] run {
		name info
		tellraw @s [{"score":{"name":"#percent","objective":"mulSle.config"},"color":"aqua"},{"text":"%","color":"aqua"},{"text":" of players in the overworld must sleep to skip the night and the rain.","color":"dark_aqua"}]
		scoreboard players set @a mulSle 0
	}
	execute if score #sleeping mulSle.dummy matches 1.. run {
		name check_sleeping
		execute as @a[predicate=multiplayer_sleep:overworld] at @s run tag @s add mulSle.total
		execute store result score #total mulSle.dummy if entity @a[tag=mulSle.total,gamemode=!spectator]
		execute as @a[tag=mulSle.total,gamemode=!spectator] if data entity @s SleepingX run tag @s add mulSle.sleeping
		execute store result score #sleeping mulSle.dummy if entity @a[tag=mulSle.sleeping]
		execute if score #sleeping mulSle.dummy matches 0 run {
			name reset_progress
			scoreboard players set #timer mulSle.dummy 0
			bossbar set multiplayer_sleep:progress visible false
		}
		execute unless score #sleeping mulSle.dummy matches 0 run {
			name sleeping
			scoreboard players operation #total mulSle.dummy *= #percent mulSle.config
			scoreboard players operation #total mulSle.dummy /= #total mulSle.config
			execute if score #total mulSle.dummy matches 0 run scoreboard players set #total mulSle.dummy 1
			execute store result bossbar multiplayer_sleep:progress max run scoreboard players get #total mulSle.dummy
			execute store result bossbar multiplayer_sleep:progress value run scoreboard players get #sleeping mulSle.dummy
			bossbar set multiplayer_sleep:progress name [{"score":{"name":"#sleeping","objective":"mulSle.dummy"}}," of ",{"score":{"name":"#total","objective":"mulSle.dummy"}}," player(s) asleep"]
			bossbar set multiplayer_sleep:progress players @a[tag=mulSle.total]
			bossbar set multiplayer_sleep:progress visible true
			execute if score #sleeping mulSle.dummy < #total mulSle.dummy run scoreboard players set #timer mulSle.dummy 0
			execute unless score #sleeping mulSle.dummy < #total mulSle.dummy run {
				name sufficient_sleeping
				scoreboard players add #timer mulSle.dummy 1
				execute if score #timer mulSle.dummy matches 100 run {
					name stop_sleeping
					function multiplayer_sleep:reset_progress
					scoreboard players set #sleeping mulSle.dummy 0
					scoreboard players set #remaining mulSle.dummy 24000
					execute store result score #time mulSle.dummy run time query daytime
					scoreboard players operation #remaining mulSle.dummy -= #time mulSle.dummy
					execute if score #remaining mulSle.dummy >= #bit14 mulSle.dummy run {
						name add_time/bit_14
						time add 16384
						scoreboard players remove #remaining mulSle.dummy 16384
					}
					execute if score #remaining mulSle.dummy >= #bit13 mulSle.dummy run {
						name add_time/bit_13
						time add 8192
						scoreboard players remove #remaining mulSle.dummy 8192
					}
					execute if score #remaining mulSle.dummy >= #bit12 mulSle.dummy run {
						name add_time/bit_12
						time add 4096
						scoreboard players remove #remaining mulSle.dummy 4096
					}
					execute if score #remaining mulSle.dummy >= #bit11 mulSle.dummy run {
						name add_time/bit_11
						time add 2048
						scoreboard players remove #remaining mulSle.dummy 2048
					}
					execute if score #remaining mulSle.dummy >= #bit10 mulSle.dummy run {
						name add_time/bit_10
						time add 1024
						scoreboard players remove #remaining mulSle.dummy 1024
					}
					execute if score #remaining mulSle.dummy >= #bit9 mulSle.dummy run {
						name add_time/bit_9
						time add 512
						scoreboard players remove #remaining mulSle.dummy 512
					}
					execute if score #remaining mulSle.dummy >= #bit8 mulSle.dummy run {
						name add_time/bit_8
						time add 256
						scoreboard players remove #remaining mulSle.dummy 256
					}
					execute if score #remaining mulSle.dummy >= #bit7 mulSle.dummy run {
						name add_time/bit_7
						time add 128
						scoreboard players remove #remaining mulSle.dummy 128
					}
					execute if score #remaining mulSle.dummy >= #bit6 mulSle.dummy run {
						name add_time/bit_6
						time add 64
						scoreboard players remove #remaining mulSle.dummy 64
					}
					execute if score #remaining mulSle.dummy >= #bit5 mulSle.dummy run {
						name add_time/bit_5
						time add 32
						scoreboard players remove #remaining mulSle.dummy 32
					}
					execute if score #remaining mulSle.dummy >= #bit4 mulSle.dummy run {
						name add_time/bit_4
						time add 16
						scoreboard players remove #remaining mulSle.dummy 16
					}
					execute if score #remaining mulSle.dummy >= #bit3 mulSle.dummy run {
						name add_time/bit_3
						time add 8
						scoreboard players remove #remaining mulSle.dummy 8
					}
					execute if score #remaining mulSle.dummy >= #bit2 mulSle.dummy run {
						name add_time/bit_2
						time add 4
						scoreboard players remove #remaining mulSle.dummy 4
					}
					execute if score #remaining mulSle.dummy >= #bit1 mulSle.dummy run {
						name add_time/bit_1
						time add 2
						scoreboard players remove #remaining mulSle.dummy 2
					}
					execute if score #remaining mulSle.dummy >= #bit0 mulSle.dummy run {
						name add_time/bit_0
						time add 1
						scoreboard players remove #remaining mulSle.dummy 1
					}
					execute if predicate multiplayer_sleep:raining run weather rain 1
					execute if predicate multiplayer_sleep:thundering run weather thunder 1
				}
			}
			tag @a remove mulSle.sleeping
		}
		tag @a remove mulSle.total
	}
	execute if score #sleeping mulSle.dummy matches -1 if predicate multiplayer_sleep:clear_day run scoreboard players set #sleeping mulSle.dummy 0
}
function start_sleeping {
	advancement revoke @s only multiplayer_sleep:slept_in_bed
	execute if predicate multiplayer_sleep:overworld unless score #sleeping mulSle.dummy matches -1 run scoreboard players set #sleeping mulSle.dummy 1
}
function config {
	function multiplayer_sleep:info
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/scoreboard players set #percent mulSle.config <percentage>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #percent mulSle.config "},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/scoreboard players set #percent mulSle.config","color":"aqua"},{"text":".\nEnter the number 0 to 100 after clicking.","color":"dark_aqua"}]}},{"text":" to set the percentage of players in the overworld required to sleep to skip the night and the rain. The default is ","color":"dark_aqua"},{"text":"50","color":"aqua","clickEvent":{"action":"run_command","value":"/scoreboard players set #percent mulSle.config 50"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/scoreboard players set #percent mulSle.config 50","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":".","color":"dark_aqua"}]
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/bossbar set multiplayer_sleep:progress color <color>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/bossbar set multiplayer_sleep:progress color "},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/bossbar set multiplayer_sleep:progress color","color":"aqua"},{"text":".\nEnter the color after clicking.","color":"dark_aqua"}]}},{"text":" to set the color of the sleep progress bar. The default is ","color":"dark_aqua"},{"text":"white","color":"aqua","clickEvent":{"action":"run_command","value":"/bossbar set multiplayer_sleep:progress color white"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/bossbar set multiplayer_sleep:progress color white","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":".","color":"dark_aqua"}]
}
