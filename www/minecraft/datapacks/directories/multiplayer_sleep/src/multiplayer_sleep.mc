function load {
	scoreboard objectives add mpSleep.config dummy "Multiplayer Sleep Config"
	scoreboard objectives add mpSleep.dummy dummy
	scoreboard objectives add mpSleep trigger "Multiplayer Sleep"
	scoreboard objectives add mpSleep.sleep dummy
	scoreboard players set #total mpSleep.config 100
	execute unless score #percent mpSleep.config matches 0..100 run scoreboard players set #percent mpSleep.config 0
	execute unless score #display mpSleep.config matches 0..3 run scoreboard players set #display mpSleep.config 1
	execute unless score #immediateChat mpSleep.config matches 0..1 run scoreboard players set #immediateChat mpSleep.config 0
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
	scoreboard objectives remove mpSleep.dummy
	scoreboard objectives remove mpSleep
	scoreboard objectives remove mpSleep.sleep
	bossbar remove multiplayer_sleep:progress
	bossbar remove multiplayer_sleep:preview
	schedule clear multiplayer_sleep:tick
}
clock 1t {
	name tick
	execute as @a[scores={mpSleep=1..}] run {
		name trigger
		execute if score @s mpSleep matches 7.. run {
			name trigger/use_config
			execute if score @s mpSleep matches 7 run scoreboard players reset @s mpSleep.config
			execute if score @s mpSleep matches 8 run scoreboard players set @s mpSleep.config 1
			execute if score @s mpSleep matches 9 run scoreboard players set @s mpSleep.config 2
			execute if score @s mpSleep matches 10 run scoreboard players set @s mpSleep.config 3
			scoreboard players set @s mpSleep 3
		}
		execute if score @s mpSleep matches 1 run {
			name trigger/index
			tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
			tellraw @s ["                        Multiplayer Sleep",{"text":" / ","color":"gray"},"Info                         "]
			tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
			execute if score #percent mpSleep.config matches 0 run tellraw @s ["",{"text":">> ","color":"gray"},"1 player in the overworld must sleep to skip the night and the rain."]
			execute unless score #percent mpSleep.config matches 0 run tellraw @s ["",{"text":">> ","color":"gray"},{"score":{"name":"#percent","objective":"mpSleep.config"}},"% of players in the overworld must sleep to skip the night and the rain."]
			tellraw @s ["",{"text":">> ","color":"gold"},{"text":"[ Personal Settings ]","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 3"},"hoverEvent":{"action":"show_text","value":{"text":"Click to show personal settings.","color":"gray"}}}]
			tellraw @s ["",{"text":">> ","color":"gold"},{"text":"[ List Sleeping Players ]","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 2"},"hoverEvent":{"action":"show_text","value":{"text":"Click to list sleeping players.","color":"gray"}}}]
			tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
		}
		execute if score @s mpSleep matches 2 run {
			name trigger/list_sleeping_players
			execute store success score #sleeping mpSleep.dummy as @a[gamemode=!spectator,predicate=multiplayer_sleep:overworld] if data entity @s SleepingX run tag @s add mpSleep.sleeping
			execute if score #sleeping mpSleep.dummy matches 0 run tellraw @s {"text":"There are no sleeping players.","color":"red"}
			execute unless score #sleeping mpSleep.dummy matches 0 run tellraw @s [{"text":"Sleeping players: ","color":"dark_aqua"},{"selector":"@a[tag=mpSleep.sleeping]","color":"aqua"}]
			tag @a remove mpSleep.sleeping
		}
		execute if score @s mpSleep matches 3 run {
			name trigger/config
			tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
			tellraw @s ["                Multiplayer Sleep",{"text":" / ","color":"gray"},"Personal Settings                "]
			tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
			execute if score @s mpSleep.config matches 0.. run {
				name trigger/show_disabled_display_default
				execute if score #display mpSleep.config matches 0 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 7"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Display: Default",{"text":".","color":"green"}]}}," Display: Default (Hidden)"]
				execute if score #display mpSleep.config matches 1 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 7"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Display: Default",{"text":".","color":"green"}]}}," Display: Default (Boss Bar)"]
				execute if score #display mpSleep.config matches 2 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 7"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Display: Default",{"text":".","color":"green"}]}}," Display: Default (Action Bar)"]
				execute if score #display mpSleep.config matches 3 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 7"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Display: Default",{"text":".","color":"green"}]}}," Display: Default (Chat)"]
			}
			execute unless score @s mpSleep.config matches 0.. run {
				name trigger/show_enabled_display_default
				execute if score #display mpSleep.config matches 0 run tellraw @s ["",{"text":"[ ✔ ]","color":"green"}," Display: Default (Hidden)"]
				execute if score #display mpSleep.config matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green"}," Display: Default (Boss Bar)"]
				execute if score #display mpSleep.config matches 2 run tellraw @s ["",{"text":"[ ✔ ]","color":"green"}," Display: Default (Action Bar)"]
				execute if score #display mpSleep.config matches 3 run tellraw @s ["",{"text":"[ ✔ ]","color":"green"}," Display: Default (Chat)"]
			}
			execute if score @s mpSleep.config matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 7"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Display: Boss Bar",{"text":".","color":"red"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 4"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Display: Boss Bar",{"text":".\nThe boss bar preview's color may not be accurate.","color":"dark_gray"}]}}," Display: Boss Bar"]
			execute unless score @s mpSleep.config matches 1 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 8"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Display: Boss Bar",{"text":".","color":"green"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 4"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Display: Boss Bar",{"text":".\nThe boss bar preview's color may not be accurate.","color":"dark_gray"}]}}," Display: Boss Bar"]
			execute if score @s mpSleep.config matches 2 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 7"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Display: Action Bar",{"text":".","color":"red"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 5"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Display: Action Bar",{"text":".","color":"gray"}]}}," Display: Action Bar"]
			execute unless score @s mpSleep.config matches 2 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 9"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Display: Action Bar",{"text":".","color":"green"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 5"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Display: Action Bar",{"text":".","color":"gray"}]}}," Display: Action Bar"]
			execute if score @s mpSleep.config matches 3 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 7"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Display: Chat",{"text":".","color":"red"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 6"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Display: Chat",{"text":".","color":"gray"}]}}," Display: Chat"]
			execute unless score @s mpSleep.config matches 3 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 10"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Display: Chat",{"text":".","color":"green"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 6"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Display: Chat",{"text":".","color":"gray"}]}}," Display: Chat"]
			tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
		}
		execute if score @s mpSleep matches 4 run {
			name trigger/preview_display_boss_bar
			bossbar set multiplayer_sleep:preview players @s
			schedule 5s replace {
				name trigger/undo_preview_display_boss_bar
				bossbar set multiplayer_sleep:preview players
			}
		}
		title @s[scores={mpSleep=5}] actionbar {"text":"1 of 2 player(s) asleep","color":"aqua"}
		tellraw @s[scores={mpSleep=6}] [{"text":"Player","color":"aqua"},{"text":" went to sleep. 1 of 2 player(s) asleep","color":"dark_aqua"}]
		scoreboard players set @s mpSleep 0
		scoreboard players enable @s mpSleep
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
			execute if score #immediateChat mpSleep.config matches 1 as @a[tag=mpSleep.sleeping,scores={mpSleep.sleep=1}] run tellraw @a[tag=mpSleep.display3] ["",{"selector":"@s","color":"aqua"},{"text":" went to sleep. ","color":"dark_aqua"},{"score":{"name":"#sleeping","objective":"mpSleep.dummy"},"color":"aqua"},{"text":" of ","color":"aqua"},{"score":{"name":"#total","objective":"mpSleep.dummy"},"color":"aqua"},{"text":" player(s) asleep","color":"dark_aqua"}]
			execute unless score #immediateChat mpSleep.config matches 1 as @a[tag=mpSleep.sleeping,scores={mpSleep.sleep=100}] run {
				name announce_asleep
				scoreboard players add #asleep mpSleep.dummy 1
				execute if score #asleep mpSleep.dummy = #total mpSleep.dummy run tellraw @a[tag=mpSleep.display3] ["",{"selector":"@s","color":"aqua"},{"text":" went to sleep. Sweet dreams!","color":"dark_aqua"}]
				execute unless score #asleep mpSleep.dummy = #total mpSleep.dummy unless score #asleep mpSleep.dummy > #total mpSleep.dummy run tellraw @a[tag=mpSleep.display3] ["",{"selector":"@s","color":"aqua"},{"text":" went to sleep. ","color":"dark_aqua"},{"score":{"name":"#asleep","objective":"mpSleep.dummy"},"color":"aqua"},{"text":" of ","color":"aqua"},{"score":{"name":"#total","objective":"mpSleep.dummy"},"color":"aqua"},{"text":" player(s) asleep","color":"dark_aqua"}]
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
clock 1s {
	name enable_trigger
	scoreboard players enable @a mpSleep
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
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	tellraw @s ["                  Multiplayer Sleep",{"text":" / ","color":"gray"},"Global Settings                  "]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	execute if score #display mpSleep.config matches 0 run tellraw @s ["",{"text":"[ ✔ ]","color":"green"}," Default Display: Hidden"]
	execute unless score #display mpSleep.config matches 0 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function multiplayer_sleep:config/enable_default_display_hidden"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Default Display: Hidden",{"text":".","color":"green"}]}}," Default Display: Hidden"]
	execute if score #display mpSleep.config matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function multiplayer_sleep:config/enable_default_display_hidden"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Default Display: Boss Bar",{"text":".","color":"red"},{"text":"\nDefault","color":"dark_gray"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 4"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Default Display: Boss Bar",{"text":".\nThe boss bar preview's color may not be accurate.","color":"dark_gray"}]}}," Default Display: Boss Bar"]
	execute unless score #display mpSleep.config matches 1 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function multiplayer_sleep:config/enable_default_display_boss_bar"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Default Display: Boss Bar",{"text":".","color":"green"},{"text":"\nDefault","color":"dark_gray"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 4"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Default Display: Boss Bar",{"text":".\nThe boss bar preview's color may not be accurate.","color":"dark_gray"}]}}," Default Display: Boss Bar"]
	execute if score #display mpSleep.config matches 2 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function multiplayer_sleep:config/enable_default_display_hidden"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Default Display: Action Bar",{"text":".","color":"red"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 5"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Default Display: Action Bar",{"text":".","color":"gray"}]}}," Default Display: Action Bar"]
	execute unless score #display mpSleep.config matches 2 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function multiplayer_sleep:config/enable_default_display_action_bar"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Default Display: Action Bar",{"text":".","color":"green"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 5"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Default Display: Action Bar",{"text":".","color":"gray"}]}}," Default Display: Action Bar"]
	execute if score #display mpSleep.config matches 3 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function multiplayer_sleep:config/enable_default_display_hidden"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Default Display: Chat",{"text":".","color":"red"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 6"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Default Display: Chat",{"text":".","color":"gray"}]}}," Default Display: Chat"]
	execute unless score #display mpSleep.config matches 3 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function multiplayer_sleep:config/enable_default_display_chat"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Default Display: Chat",{"text":".","color":"green"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger mpSleep set 6"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Default Display: Chat",{"text":".","color":"gray"}]}}," Default Display: Chat"]
	execute if score #immediateChat mpSleep.config matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function multiplayer_sleep:config/disable_immediate_chat"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Immediate Chat Display",{"text":".","color":"red"},{"text":"\nWhen enabled, this sends Chat Display messages at the time the player enters the bed rather than after 5 seconds of sleeping.","color":"gray"},{"text":"\nDefault: Disabled","color":"dark_gray"}]}}," Immediate Chat Display"]
	execute unless score #immediateChat mpSleep.config matches 1 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function multiplayer_sleep:config/enable_immediate_chat"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Immediate Chat Display",{"text":".","color":"green"},{"text":"\nWhen enabled, this sends Chat Display messages at the time the player enters the bed rather than after 5 seconds of sleeping.","color":"gray"},{"text":"\nDefault: Disabled","color":"dark_gray"}]}}," Immediate Chat Display"]
	tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #percent mpSleep.config "},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enter the percentage of players required to sleep.\nEnter ","color":"gray"},"0",{"text":" to require only one player.","color":"gray"},{"text":"\nAccepts: whole numbers 0-100\nDefault: 0","color":"dark_gray"}]}}," Players Required to Sleep",{"text":" (Current: ","color":"gray"},{"score":{"name":"#percent","objective":"mpSleep.config"},"color":"gray"},{"text":"%)","color":"gray"}]
	tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/bossbar set multiplayer_sleep:progress color "},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enter a color for the boss bar display.","color":"gray"},{"text":"\nAccepts: blue, green, pink, purple, red, white, yellow\nDefault: white","color":"dark_gray"}]}}," Boss Bar Color"]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	execute store result score #sendCommandFeedback mpSleep.dummy run gamerule sendCommandFeedback
	execute if score #sendCommandFeedback mpSleep.dummy matches 1 run {
		name hide_command_feedback
		gamerule sendCommandFeedback false
		schedule 1t replace {
			name restore_command_feedback
			gamerule sendCommandFeedback true
		}
	}
}
dir config {
	function enable_default_display_hidden {
		scoreboard players set #display mpSleep.config 0
		function multiplayer_sleep:config
	}
	function enable_default_display_boss_bar {
		scoreboard players set #display mpSleep.config 1
		function multiplayer_sleep:config
	}
	function enable_default_display_action_bar {
		scoreboard players set #display mpSleep.config 2
		function multiplayer_sleep:config
	}
	function enable_default_display_chat {
		scoreboard players set #display mpSleep.config 3
		function multiplayer_sleep:config
	}
	function enable_immediate_chat {
		scoreboard players set #immediateChat mpSleep.config 1
		function multiplayer_sleep:config
	}
	function disable_immediate_chat {
		scoreboard players set #immediateChat mpSleep.config 0
		function multiplayer_sleep:config
	}
}
