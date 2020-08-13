function load {
	scoreboard objectives add mpSleep.config trigger "Multiplayer Sleep Config"
	scoreboard objectives add mpSleep trigger "Multiplayer Sleep"
	scoreboard objectives add mpSleep.dummy dummy
	scoreboard objectives add mpSleep.sleep dummy
	scoreboard players set #total mpSleep.config 100
	execute unless score #percent mpSleep.config matches 0..100 run scoreboard players set #percent mpSleep.config 0
	execute unless score #display mpSleep.config matches 0..3 run scoreboard players set #display mpSleep.config 1
	bossbar add multiplayer_sleep:progress "Multiplayer Sleep Progress"
	bossbar add multiplayer_sleep:preview "Multiplayer Sleep Progress"
	bossbar set multiplayer_sleep:preview name "1 of 2 player(s) asleep"
	bossbar set multiplayer_sleep:preview visible true
	bossbar set multiplayer_sleep:preview value 1
	bossbar set multiplayer_sleep:preview max 2
	bossbar set multiplayer_sleep:preview players
}
function uninstall {
	scoreboard objectives remove mpSleep.config
	scoreboard objectives remove mpSleep
	scoreboard objectives remove mpSleep.dummy
	scoreboard objectives remove mpSleep.sleep
	bossbar remove multiplayer_sleep:progress
	bossbar remove multiplayer_sleep:preview
	schedule clear multiplayer_sleep:tick
}
clock 1t {
	name tick
	scoreboard players enable @a mpSleep
	scoreboard players enable @a mpSleep.config
	execute as @a[scores={mpSleep=1..}] run {
		name trigger
		execute if score @s mpSleep matches 1 run {
			name info_1
			execute if score #percent mpSleep.config matches 0 run tellraw @s [{"text":"1","color":"aqua"},{"text":" player in the overworld must sleep to skip the night and the rain.","color":"dark_aqua"}]
			execute unless score #percent mpSleep.config matches 0 run tellraw @s [{"score":{"name":"#percent","objective":"mpSleep.config"},"color":"aqua"},{"text":"%","color":"aqua"},{"text":" of players in the overworld must sleep to skip the night and the rain.","color":"dark_aqua"}]
			tellraw @s [{"text":"- [ ","color":"dark_aqua"},{"text":"Show Display Options","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 3"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to show display options.","color":"dark_aqua"}]}},{"text":" ]","color":"dark_aqua"}]
			tellraw @s [{"text":"- [ ","color":"dark_aqua"},{"text":"List Sleeping Players","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 2"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to list sleeping players.","color":"dark_aqua"}]}},{"text":" ]","color":"dark_aqua"}]
		}
		execute if score @s mpSleep matches 2 run {
			name info_2
			execute store success score #sleeping mpSleep.dummy as @a[gamemode=!spectator,predicate=multiplayer_sleep:overworld] if data entity @s SleepingX run tag @s add mpSleep.sleeping
			execute if score #sleeping mpSleep.dummy matches 0 run tellraw @s {"text":"There are no sleeping players.","color":"red"}
			execute unless score #sleeping mpSleep.dummy matches 0 run tellraw @s [{"text":"Sleeping players: ","color":"dark_aqua"},{"selector":"@a[tag=mpSleep.sleeping]","color":"aqua"}]
			tag @a remove mpSleep.sleeping
		}
		execute if score @s mpSleep matches 3 run {
			name info_3
			tellraw @s [{"text":"[ Display Options ]","color":"gold"},{"text":"\n- Boss Bar: [","color":"dark_aqua"},{"text":"Set","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mpSleep.config set 1"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to set ","color":"dark_aqua"},{"text":"Boss Bar","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":"] [","color":"dark_aqua"},{"text":"Preview","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 4"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to preview ","color":"dark_aqua"},{"text":"Boss Bar","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":"]\n- Action Bar: [","color":"dark_aqua"},{"text":"Set","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mpSleep.config set 2"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to set ","color":"dark_aqua"},{"text":"Action Bar","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":"] [","color":"dark_aqua"},{"text":"Preview","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 5"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to preview ","color":"dark_aqua"},{"text":"Action Bar","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":"]\n- Chat: [","color":"dark_aqua"},{"text":"Set","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mpSleep.config set 3"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to set ","color":"dark_aqua"},{"text":"Chat","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":"] [","color":"dark_aqua"},{"text":"Preview","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 6"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to preview ","color":"dark_aqua"},{"text":"Chat","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":"]\n- [ ","color":"dark_aqua"},{"text":"Reset to Default","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger mpSleep.config set 0"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to reset.","color":"dark_aqua"}]}},{"text":" ]","color":"dark_aqua"}]
		}
		execute if score @s mpSleep matches 4 run {
			name preview_1
			bossbar set multiplayer_sleep:preview players @s
			schedule 5s replace {
				name undo_preview_1
				bossbar set multiplayer_sleep:preview players
			}
		}
		execute if score @s mpSleep matches 5 run {
			name preview_2
			title @s actionbar {"text":"1 of 2 player(s) asleep","color":"aqua"}
		}
		tellraw @s[scores={mpSleep=6}] [{"text":"Player","color":"aqua"},{"text":" is now sleeping. 1 of 2 player(s) asleep","color":"dark_aqua"}]
		scoreboard players set @s mpSleep 0
	}
	execute if score #sleeping mpSleep.dummy matches 1.. run {
		name check_sleeping
		execute as @a[predicate=multiplayer_sleep:overworld] at @s run tag @s add mpSleep.total
		execute store result score #total mpSleep.dummy if entity @a[tag=mpSleep.total,gamemode=!spectator]
		execute as @a[tag=mpSleep.total,gamemode=!spectator] if data entity @s SleepingX run tag @s add mpSleep.sleeping
		execute store result score #sleeping mpSleep.dummy if entity @a[tag=mpSleep.sleeping]
		execute if score #sleeping mpSleep.dummy matches 0 run function multiplayer_sleep:reset_progress
		execute unless score #sleeping mpSleep.dummy matches 0 run {
			name sleeping
			scoreboard players operation #total mpSleep.dummy *= #percent mpSleep.config
			scoreboard players operation #total mpSleep.dummy /= #total mpSleep.config
			execute if score #total mpSleep.dummy matches 0 run scoreboard players set #total mpSleep.dummy 1
			scoreboard players reset @a[tag=!mpSleep.sleeping] mpSleep.sleep
			scoreboard players add @a[tag=mpSleep.sleeping] mpSleep.sleep 1
			execute store result score #asleep mpSleep.dummy if entity @a[tag=mpSleep.sleeping,scores={mpSleep.sleep=101..}]
			execute if score #display mpSleep.config matches 1 as @a[tag=mpSleep.total] unless score @s mpSleep.config matches 1.. run tag @s add mpSleep.display1
			execute if score #display mpSleep.config matches 2 as @a[tag=mpSleep.total] unless score @s mpSleep.config matches 1.. run tag @s add mpSleep.display2
			execute if score #display mpSleep.config matches 3 as @a[tag=mpSleep.total] unless score @s mpSleep.config matches 1.. run tag @s add mpSleep.display3
			execute as @a unless score @s mpSleep.config matches 1..3 run scoreboard players set @s mpSleep.config 0
			tag @a[scores={mpSleep.config=1}] add mpSleep.display1
			tag @a[scores={mpSleep.config=2}] add mpSleep.display2
			tag @a[scores={mpSleep.config=3}] add mpSleep.display3
			execute store result bossbar multiplayer_sleep:progress max run scoreboard players get #total mpSleep.dummy
			execute store result bossbar multiplayer_sleep:progress value run scoreboard players get #sleeping mpSleep.dummy
			bossbar set multiplayer_sleep:progress name [{"score":{"name":"#sleeping","objective":"mpSleep.dummy"}}," of ",{"score":{"name":"#total","objective":"mpSleep.dummy"}}," player(s) asleep"]
			bossbar set multiplayer_sleep:progress players @a[tag=mpSleep.display1]
			bossbar set multiplayer_sleep:progress visible true
			title @a[tag=mpSleep.display2] actionbar [{"score":{"name":"#sleeping","objective":"mpSleep.dummy"},"color":"aqua"},{"text":" of ","color":"aqua"},{"score":{"name":"#total","objective":"mpSleep.dummy"},"color":"aqua"},{"text":" player(s) asleep","color":"aqua"}]
			execute as @a[tag=mpSleep.sleeping,scores={mpSleep.sleep=100}] run {
				name announce_asleep
				scoreboard players add #asleep mpSleep.dummy 1
				execute if score #asleep mpSleep.dummy = #total mpSleep.dummy run tellraw @a[tag=mpSleep.display3] ["",{"selector":"@s","color":"aqua"},{"text":" is now sleeping. Sweet dreams!","color":"dark_aqua"}]
				execute unless score #asleep mpSleep.dummy = #total mpSleep.dummy unless score #asleep mpSleep.dummy > #total mpSleep.dummy run tellraw @a[tag=mpSleep.display3] ["",{"selector":"@s","color":"aqua"},{"text":" is now sleeping. ","color":"dark_aqua"},{"score":{"name":"#asleep","objective":"mpSleep.dummy"},"color":"aqua"},{"text":" of ","color":"aqua"},{"score":{"name":"#total","objective":"mpSleep.dummy"},"color":"aqua"},{"text":" player(s) asleep","color":"dark_aqua"}]
			}
			tag @a remove mpSleep.display1
			tag @a remove mpSleep.display2
			tag @a remove mpSleep.display3
			execute unless score #asleep mpSleep.dummy < #total mpSleep.dummy run {
				name sufficient_sleeping
				function multiplayer_sleep:reset_progress
				scoreboard players set #sleeping mpSleep.dummy 0
				scoreboard players set #remaining mpSleep.dummy 24000
				execute store result score #time mpSleep.dummy run time query daytime
				scoreboard players operation #remaining mpSleep.dummy -= #time mpSleep.dummy
				LOOP (15, i) {
					execute if score #remaining mpSleep.dummy matches <%2 ** (14 - this.i)%>.. run {
						name add_time/bit_<%14 - this.i%>
						time add <%2 ** (14 - this.i)%>
						scoreboard players remove #remaining mpSleep.dummy <%2 ** (14 - this.i)%>
					}
				}
				execute if predicate multiplayer_sleep:raining run weather rain 1
				execute if predicate multiplayer_sleep:thundering run weather thunder 1
			}
			tag @a remove mpSleep.sleeping
		}
		tag @a remove mpSleep.total
	}
	execute if score #sleeping mpSleep.dummy matches -1 if predicate multiplayer_sleep:clear_day run scoreboard players set #sleeping mpSleep.dummy 0
}
function start_sleeping {
	advancement revoke @s only multiplayer_sleep:slept_in_bed
	execute if predicate multiplayer_sleep:overworld unless score #sleeping mpSleep.dummy matches -1 run scoreboard players set #sleeping mpSleep.dummy 1
}
function reset_progress {
	scoreboard players reset * mpSleep.sleep
	bossbar set multiplayer_sleep:progress visible false
}
function config {
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/scoreboard players set #percent mpSleep.config <percentage>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #percent mpSleep.config "},"hoverEvent":{"action":"show_text","value":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/scoreboard players set #percent mpSleep.config","color":"aqua"},{"text":".\nEnter the number 0 to 100 after clicking.","color":"dark_aqua"}]}},{"text":" to set the percentage of players in the overworld required to sleep to skip the night and the rain. Use 0 to only require one player to sleep. The default is ","color":"dark_aqua"},{"text":"0","color":"aqua","clickEvent":{"action":"run_command","value":"/scoreboard players set #percent mpSleep.config 0"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/scoreboard players set #percent mpSleep.config 0","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":". The current value is ","color":"dark_aqua"},{"score":{"name":"#percent","objective":"mpSleep.config"},"color":"aqua"},{"text":".","color":"dark_aqua"}]
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/scoreboard players set #display mpSleep.config <0, 1, 2, or 3>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #display mpSleep.config "},"hoverEvent":{"action":"show_text","value":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/scoreboard players set #display mpSleep.config","color":"aqua"},{"text":".\nEnter 0, 1, 2, or 3 after clicking.","color":"dark_aqua"}]}},{"text":" to set how to display that players are sleeping by default. 0 is hidden, 1 is boss bar, 2 is action bar, and 3 is chat. The default is ","color":"dark_aqua"},{"text":"1","color":"aqua","clickEvent":{"action":"run_command","value":"/scoreboard players set #display mpSleep.config 1"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/scoreboard players set #display mpSleep.config 1","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":". The current value is ","color":"dark_aqua"},{"score":{"name":"#display","objective":"mpSleep.config"},"color":"aqua"},{"text":".","color":"dark_aqua"}]
	tellraw @s [{"text":"Enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/bossbar set multiplayer_sleep:progress color <color>","color":"aqua","clickEvent":{"action":"suggest_command","value":"/bossbar set multiplayer_sleep:progress color "},"hoverEvent":{"action":"show_text","value":[{"text":"Click to write ","color":"dark_aqua"},{"text":"/bossbar set multiplayer_sleep:progress color","color":"aqua"},{"text":".\nEnter the color after clicking.","color":"dark_aqua"}]}},{"text":" to set the color of the sleep progress bar. The default is ","color":"dark_aqua"},{"text":"white","color":"aqua","clickEvent":{"action":"run_command","value":"/bossbar set multiplayer_sleep:progress color white"},"hoverEvent":{"action":"show_text","value":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/bossbar set multiplayer_sleep:progress color white","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":".","color":"dark_aqua"}]
}
