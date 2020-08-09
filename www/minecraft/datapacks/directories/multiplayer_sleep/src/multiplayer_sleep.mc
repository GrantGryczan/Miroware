function load {
	scoreboard objectives add mulSle.config trigger "Multiplayer Sleep Config"
	scoreboard objectives add mulSle trigger "Multiplayer Sleep"
	scoreboard objectives add mulSle.dummy dummy
	scoreboard objectives add mulSle.sleepTime dummy
	scoreboard players set #total mulSle.config 100
	execute unless score #percent mulSle.config matches 0..100 run scoreboard players set #percent mulSle.config 0
	execute unless score #display mulSle.config matches 1..3 run scoreboard players set #display mulSle.config 1
	bossbar add multiplayer_sleep:progress "Multiplayer Sleep Progress"
	bossbar add multiplayer_sleep:preview "Multiplayer Sleep Progress"
	bossbar set multiplayer_sleep:preview name "1 of 2 player(s) asleep"
	bossbar set multiplayer_sleep:preview visible true
	bossbar set multiplayer_sleep:preview value 1
	bossbar set multiplayer_sleep:preview max 2
	bossbar set multiplayer_sleep:preview players
}
function uninstall {
	scoreboard objectives remove mulSle.config
	scoreboard objectives remove mulSle
	scoreboard objectives remove mulSle.dummy
	scoreboard objectives remove mulSle.sleepTime
	bossbar remove multiplayer_sleep:progress
	bossbar remove multiplayer_sleep:preview
	schedule clear multiplayer_sleep:tick
}
clock 1t {
	name tick
	scoreboard players enable @a mulSle
	scoreboard players enable @a mulSle.config
	execute as @a[scores={mulSle=1..}] run {
		name trigger
		execute if score @s mulSle matches 1 run {
			name info_1
			execute if score #percent mulSle.config matches 0 run tellraw @s [{"text":"1","color":"aqua"},{"text":" player in the overworld must sleep to skip the night and the rain.","color":"dark_aqua"}]
			execute unless score #percent mulSle.config matches 0 run tellraw @s [{"score":{"name":"#percent","objective":"mulSle.config"},"color":"aqua"},{"text":"%","color":"aqua"},{"text":" of players in the overworld must sleep to skip the night and the rain.","color":"dark_aqua"}]
			tellraw @s [{"text":"- [ ","color":"dark_aqua"},{"text":"Show Display Options","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mulSle set 3"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to show display options.","color":"dark_aqua"}]}},{"text":" ]","color":"dark_aqua"}]
			tellraw @s [{"text":"- [ ","color":"dark_aqua"},{"text":"List Sleeping Players","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mulSle set 2"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to list sleeping players.","color":"dark_aqua"}]}},{"text":" ]","color":"dark_aqua"}]
		}
		execute if score @s mulSle matches 2 run {
			name info_2
			execute store success score #sleeping mulSle.dummy as @a[gamemode=!spectator,predicate=multiplayer_sleep:overworld] if data entity @s SleepingX run tag @s add mulSle.sleeping
			execute if score #sleeping mulSle.dummy matches 0 run tellraw @s {"text":"There are no sleeping players.","color":"red"}
			execute unless score #sleeping mulSle.dummy matches 0 run tellraw @s [{"text":"Sleeping players: ","color":"dark_aqua"},{"selector":"@a[tag=mulSle.sleeping]","color":"aqua"}]
			tag @a remove mulSle.sleeping
		}
		execute if score @s mulSle matches 3 run {
			name info_3
			tellraw @s [{"text":"[ Display Options ]","color":"gold"},{"text":"\n- Boss Bar: [","color":"dark_aqua"},{"text":"Set","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mulSle.config set 1"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to set ","color":"dark_aqua"},{"text":"Boss Bar","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":"] [","color":"dark_aqua"},{"text":"Preview","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mulSle set 4"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to preview ","color":"dark_aqua"},{"text":"Boss Bar","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":"]\n- Action Bar: [","color":"dark_aqua"},{"text":"Set","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mulSle.config set 2"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to set ","color":"dark_aqua"},{"text":"Action Bar","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":"] [","color":"dark_aqua"},{"text":"Preview","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mulSle set 5"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to preview ","color":"dark_aqua"},{"text":"Action Bar","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":"]\n- Chat: [","color":"dark_aqua"},{"text":"Set","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mulSle.config set 3"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to set ","color":"dark_aqua"},{"text":"Chat","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":"] [","color":"dark_aqua"},{"text":"Preview","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mulSle set 6"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to preview ","color":"dark_aqua"},{"text":"Chat","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":"]","color":"dark_aqua"}]
		}
		execute if score @s mulSle matches 4 run {
			name preview_1
			bossbar set multiplayer_sleep:preview players @s
			schedule 5s replace {
				name undo_preview_1
				bossbar set multiplayer_sleep:preview players
			}
		}
		execute if score @s mulSle matches 5 run {
			name preview_2
			title @s actionbar {"text":"1 of 2 player(s) asleep","color":"aqua"}
		}
		tellraw @s[scores={mulSle=6}] [{"text":"Player","color":"aqua"},{"text":" is now sleeping. 1 of 2 player(s) asleep","color":"dark_aqua"}]
		scoreboard players set @s mulSle 0
	}
	execute if score #sleeping mulSle.dummy matches 1.. run {
		name check_sleeping
		execute as @a[predicate=multiplayer_sleep:overworld] at @s run tag @s add mulSle.total
		execute store result score #total mulSle.dummy if entity @a[tag=mulSle.total,gamemode=!spectator]
		execute as @a[tag=mulSle.total,gamemode=!spectator] if data entity @s SleepingX run tag @s add mulSle.sleeping
		execute store result score #sleeping mulSle.dummy if entity @a[tag=mulSle.sleeping]
		execute if score #sleeping mulSle.dummy matches 0 run function multiplayer_sleep:reset_progress
		execute unless score #sleeping mulSle.dummy matches 0 run {
			name sleeping
			scoreboard players operation #total mulSle.dummy *= #percent mulSle.config
			scoreboard players operation #total mulSle.dummy /= #total mulSle.config
			execute if score #total mulSle.dummy matches 0 run scoreboard players set #total mulSle.dummy 1
			scoreboard players reset @a[tag=!mulSle.sleeping] mulSle.sleepTime
			scoreboard players add @a[tag=mulSle.sleeping] mulSle.sleepTime 1
			execute store result score #asleep mulSle.dummy if entity @a[tag=mulSle.sleeping,scores={mulSle.sleepTime=101..}]
			execute if score #display mulSle.config matches 1 as @a[tag=mulSle.total] unless score @s mulSle.config matches 1.. run tag @s add mulSle.display1
			execute if score #display mulSle.config matches 2 as @a[tag=mulSle.total] unless score @s mulSle.config matches 1.. run tag @s add mulSle.display2
			execute if score #display mulSle.config matches 3 as @a[tag=mulSle.total] unless score @s mulSle.config matches 1.. run tag @s add mulSle.display3
			tag @a[scores={mulSle.config=1}] add mulSle.display1
			tag @a[scores={mulSle.config=2}] add mulSle.display2
			tag @a[scores={mulSle.config=3}] add mulSle.display3
			execute store result bossbar multiplayer_sleep:progress max run scoreboard players get #total mulSle.dummy
			execute store result bossbar multiplayer_sleep:progress value run scoreboard players get #sleeping mulSle.dummy
			bossbar set multiplayer_sleep:progress name [{"score":{"name":"#sleeping","objective":"mulSle.dummy"}}," of ",{"score":{"name":"#total","objective":"mulSle.dummy"}}," player(s) asleep"]
			bossbar set multiplayer_sleep:progress players @a[tag=mulSle.display1]
			bossbar set multiplayer_sleep:progress visible true
			title @a[tag=mulSle.display2] actionbar [{"score":{"name":"#sleeping","objective":"mulSle.dummy"},"color":"aqua"},{"text":" of ","color":"aqua"},{"score":{"name":"#total","objective":"mulSle.dummy"},"color":"aqua"},{"text":" player(s) asleep","color":"aqua"}]
			execute as @a[tag=mulSle.sleeping,scores={mulSle.sleepTime=100}] run {
				name announce_asleep
				scoreboard players add #asleep mulSle.dummy 1
				execute if score #asleep mulSle.dummy = #total mulSle.dummy run tellraw @a[tag=mulSle.display3] ["",{"selector":"@s","color":"aqua"},{"text":" is now sleeping. Sweet dreams!","color":"dark_aqua"}]
				execute unless score #asleep mulSle.dummy = #total mulSle.dummy unless score #asleep mulSle.dummy > #total mulSle.dummy run tellraw @a[tag=mulSle.display3] ["",{"selector":"@s","color":"aqua"},{"text":" is now sleeping. ","color":"dark_aqua"},{"score":{"name":"#asleep","objective":"mulSle.dummy"},"color":"aqua"},{"text":" of ","color":"aqua"},{"score":{"name":"#total","objective":"mulSle.dummy"},"color":"aqua"},{"text":" player(s) asleep","color":"dark_aqua"}]
			}
			tag @a remove mulSle.display1
			tag @a remove mulSle.display2
			tag @a remove mulSle.display3
			execute unless score #asleep mulSle.dummy < #total mulSle.dummy run {
				name sufficient_sleeping
				function multiplayer_sleep:reset_progress
				scoreboard players set #sleeping mulSle.dummy 0
				scoreboard players set #remaining mulSle.dummy 24000
				execute store result score #time mulSle.dummy run time query daytime
				scoreboard players operation #remaining mulSle.dummy -= #time mulSle.dummy
				LOOP (15, i) {
					execute if score #remaining mulSle.dummy matches <%2 ** (14 - this.i)%>.. run {
						name add_time/bit_<%14 - this.i%>
						time add <%2 ** (14 - this.i)%>
						scoreboard players remove #remaining mulSle.dummy <%2 ** (14 - this.i)%>
					}
				}
				execute if predicate multiplayer_sleep:raining run weather rain 1
				execute if predicate multiplayer_sleep:thundering run weather thunder 1
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
function reset_progress {
	scoreboard players reset * mulSle.sleepTime
	bossbar set multiplayer_sleep:progress visible false
}
function config {
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/scoreboard players set #percent mulSle.config <percentage>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #percent mulSle.config "},"hoverEvent":{"action":"show_text","value":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/scoreboard players set #percent mulSle.config","color":"aqua"},{"text":".\nEnter the number 0 to 100 after clicking.","color":"dark_aqua"}]}},{"text":" to set the percentage of players in the overworld required to sleep to skip the night and the rain. Use 0 to only require one player to sleep. The default is ","color":"dark_aqua"},{"text":"0","color":"aqua","clickEvent":{"action":"run_command","value":"/scoreboard players set #percent mulSle.config 0"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/scoreboard players set #percent mulSle.config 0","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":". The current value is ","color":"dark_aqua"},{"score":{"name":"#percent","objective":"mulSle.config"},"color":"aqua"},{"text":".","color":"dark_aqua"}]
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/scoreboard players set #display mulSle.config <1, 2, or 3>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #display mulSle.config "},"hoverEvent":{"action":"show_text","value":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/scoreboard players set #display mulSle.config","color":"aqua"},{"text":".\nEnter 1, 2, or 3 after clicking.","color":"dark_aqua"}]}},{"text":" to set how to display that players are sleeping by default. 1 is boss bar, 2 is action bar, and 3 is chat. The default is ","color":"dark_aqua"},{"text":"1","color":"aqua","clickEvent":{"action":"run_command","value":"/scoreboard players set #display mulSle.config 1"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/scoreboard players set #display mulSle.config 1","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":". The current value is ","color":"dark_aqua"},{"score":{"name":"#display","objective":"mulSle.config"},"color":"aqua"},{"text":".","color":"dark_aqua"}]
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/bossbar set multiplayer_sleep:progress color <color>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/bossbar set multiplayer_sleep:progress color "},"hoverEvent":{"action":"show_text","value":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/bossbar set multiplayer_sleep:progress color","color":"aqua"},{"text":".\nEnter the color after clicking.","color":"dark_aqua"}]}},{"text":" to set the color of the sleep progress bar. The default is ","color":"dark_aqua"},{"text":"white","color":"aqua","clickEvent":{"action":"run_command","value":"/bossbar set multiplayer_sleep:progress color white"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/bossbar set multiplayer_sleep:progress color white","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":".","color":"dark_aqua"}]
}
