function load {
	scoreboard objectives add sethome trigger "Set Home"
	scoreboard objectives add homes trigger "Homes"
	scoreboard objectives add home trigger "Home"
	scoreboard objectives add namehome trigger "Name Home"
	scoreboard objectives add delhome trigger "Delete Home"
	scoreboard objectives add homes.target dummy
	scoreboard objectives add homes.delay dummy
	scoreboard objectives add homes.cooldown dummy
	scoreboard objectives add homes.dummy dummy
	scoreboard objectives add homes.config dummy "Homes Config"
	scoreboard objectives add homes.x dummy
	scoreboard objectives add homes.y dummy
	scoreboard objectives add homes.z dummy
	execute unless score #limit homes.config matches 0.. run scoreboard players set #limit homes.config 1
	execute unless score #delay homes.config matches 0.. run scoreboard players set #delay homes.config 0
	execute unless score #cooldown homes.config matches 0.. run scoreboard players set #cooldown homes.config 0
}
function uninstall {
	execute at @e[type=minecraft:item_frame,tag=homes.dimension] run forceload remove ~ ~
	kill @e[type=minecraft:item_frame,tag=homes.dimension]
	data remove storage homes:storage players
	data remove storage homes:storage lastDimension
	data remove storage homes:storage temp
	data remove storage homes:storage temp2
	scoreboard objectives remove sethome
	scoreboard objectives remove homes
	scoreboard objectives remove home
	scoreboard objectives remove namehome
	scoreboard objectives remove delhome
	scoreboard objectives remove homes.target
	scoreboard objectives remove homes.delay
	scoreboard objectives remove homes.cooldown
	scoreboard objectives remove homes.dummy
	scoreboard objectives remove homes.config
	scoreboard objectives remove homes.x
	scoreboard objectives remove homes.y
	scoreboard objectives remove homes.z
	schedule clear homes:tick
	schedule clear homes:decrement_cooldowns
}
clock 1t {
	name tick
	scoreboard players enable @a sethome
	execute as @a[scores={sethome=1..}] at @s run {
		name trigger_sethome
		execute unless entity @e[type=minecraft:item_frame,tag=homes.dimension,distance=0..] positioned 12104128 1000 -8245808 run {
			name summon_dimension_marker
			forceload add ~ ~
			summon minecraft:item_frame ~ ~ ~ {Tags:["homes.dimension","homes.new"],Fixed:1b,Invisible:1b,Item:{id:"minecraft:stone_button",Count:1b,tag:{homesData:{}}}}
			execute store result score #id homes.dummy run data get storage homes:storage lastDimension
			execute store result entity @e[type=minecraft:item_frame,tag=homes.new,limit=1] Item.tag.homesData.id int 1 run scoreboard players add #id homes.dummy 1
			execute store result storage homes:storage lastDimension int 1 run scoreboard players get #id homes.dummy
			data modify entity @e[type=minecraft:item_frame,tag=homes.new,limit=1] Item.tag.homesData.name set from entity @s Dimension
			tag @e[type=minecraft:item_frame] remove homes.new
		}
		function homes:rotate/players
		scoreboard players operation #home homes.dummy = @s sethome
		function homes:rotate/homes
		execute if score #remaining homes.dummy matches 0 run {
			name try_to_add_home
			execute if score #homes homes.dummy < #limit homes.config run {
				name add_home
				data modify storage homes:storage players[-1].homes append value {}
				function homes:set_home
			}
			execute unless score #homes homes.dummy < #limit homes.config run tellraw @s [{"text":"You can only set a maximum of ","color":"red"},{"score":{"name":"#limit","objective":"homes.config"},"color":"red"},{"text":" home(s).","color":"red"}]
		}
		execute unless score #remaining homes.dummy matches 0 run {
			name set_home
			execute store result storage homes:storage players[-1].homes[-1].id int 1 run scoreboard players get #home homes.dummy
			data modify storage homes:storage players[-1].homes[-1].dim set from entity @e[type=minecraft:item_frame,tag=homes.dimension,distance=0..,limit=1] Item.tag.homesData.id
			data modify storage homes:storage players[-1].homes[-1].pos set from entity @s Pos
			data modify storage homes:storage players[-1].homes[-1].rot set from entity @s Rotation
			execute if data storage homes:storage players[-1].homes[-1].name run tag @s add homes.nameSet
			execute if entity @s[tag=homes.nameSet] run tellraw @s [{"storage":"homes:storage","nbt":"players[-1].homes[-1].name","interpret":true,"color":"aqua"},{"text":" set.","color":"dark_aqua"}]
			execute unless entity @s[tag=homes.nameSet] if score #home homes.dummy matches 1 run tellraw @s [{"text":"Home","color":"aqua"},{"text":" set.","color":"dark_aqua"}]
			execute unless entity @s[tag=homes.nameSet] unless score #home homes.dummy matches 1 run tellraw @s [{"text":"Home ","color":"aqua"},{"score":{"name":"#home","objective":"homes.dummy"},"color":"aqua"},{"text":" set.","color":"dark_aqua"}]
			tag @s remove homes.nameSet
		}
		scoreboard players set @s sethome 0
	}
	scoreboard players enable @a delhome
	execute as @a[scores={delhome=1..}] run {
		name trigger_delhome
		function homes:rotate/players
		scoreboard players operation #home homes.dummy = @s delhome
		function homes:rotate/homes
		execute if score #remaining homes.dummy matches 0 run tellraw @s [{"text":"Home ","color":"red"},{"score":{"name":"#home","objective":"homes.dummy"},"color":"red"},{"text":" not found.","color":"red"}]
		execute unless score #remaining homes.dummy matches 0 run {
			name delete_home
			execute if data storage homes:storage players[-1].homes[-1].name run tag @s add homes.nameSet
			execute if entity @s[tag=homes.nameSet] run tellraw @s [{"storage":"homes:storage","nbt":"players[-1].homes[-1].name","interpret":true,"color":"aqua"},{"text":" deleted.","color":"dark_aqua"}]
			execute unless entity @s[tag=homes.nameSet] if score #home homes.dummy matches 1 run tellraw @s [{"text":"Home","color":"aqua"},{"text":" deleted.","color":"dark_aqua"}]
			execute unless entity @s[tag=homes.nameSet] unless score #home homes.dummy matches 1 run tellraw @s [{"text":"Home ","color":"aqua"},{"score":{"name":"#home","objective":"homes.dummy"},"color":"aqua"},{"text":" deleted.","color":"dark_aqua"}]
			tag @s remove homes.nameSet
			data remove storage homes:storage players[-1].homes[-1]
		}
		scoreboard players set @s delhome 0
	}
	scoreboard players enable @a homes
	execute as @a[scores={homes=1..}] run {
		name trigger_homes
		function homes:rotate/players
		execute store result score #homes homes.dummy run data get storage homes:storage players[-1].homes
		execute if score #homes homes.dummy matches 0 run tellraw @s {"text":"You are homeless.","color":"red"}
		execute unless score #homes homes.dummy matches 0 run {
			name list_homes
			execute store result score #reducedDebugInfo homes.dummy run gamerule reducedDebugInfo
			data modify storage homes:storage temp set from storage homes:storage players[-1].homes
			execute store result score #remaining homes.dummy store result score #homes homes.dummy run data get storage homes:storage temp
			block {
				name list_home
				scoreboard players set #id1 homes.dummy 0
				scoreboard players set #id2 homes.dummy 0
				execute unless score #remaining homes.dummy matches 1 run function homes:bubble
				execute store result score #dimension homes.dummy run data get storage homes:storage temp[0].dim
				execute as @e[type=minecraft:item_frame,tag=homes.dimension] run {
					name check_dimension_marker
					execute store result score #id homes.dummy run data get entity @s Item.tag.homesData.id
					execute if score #id homes.dummy = #dimension homes.dummy run tag @s add homes.target
				}
				execute store result score #id homes.dummy run data get storage homes:storage temp[0].id
				execute if data storage homes:storage temp[0].name run tag @s add homes.nameSet
				execute if score #reducedDebugInfo homes.dummy matches 1 run {
					name display_home_with_reduced_info
					execute if entity @s[tag=homes.nameSet] run tellraw @s [{"score":{"name":"#id","objective":"homes.dummy"},"color":"dark_aqua"},{"text":". ","color":"dark_aqua"},{"storage":"homes:storage","nbt":"temp[0].name","interpret":true,"color":"aqua"}]
					execute unless entity @s[tag=homes.nameSet] if score #id homes.dummy matches 1 run tellraw @s [{"text":"1. ","color":"dark_aqua"},{"text":"Home","color":"aqua"}]
					execute unless entity @s[tag=homes.nameSet] unless score #id homes.dummy matches 1 run tellraw @s [{"score":{"name":"#id","objective":"homes.dummy"},"color":"dark_aqua"},{"text":". ","color":"dark_aqua"},{"text":"Home ","color":"aqua"},{"score":{"name":"#id","objective":"homes.dummy"},"color":"aqua"}]
				}
				execute unless score #reducedDebugInfo homes.dummy matches 1 run {
					name display_home_with_all_info
					execute store result score #x homes.dummy run data get storage homes:storage temp[0].pos[0]
					execute store result score #y homes.dummy run data get storage homes:storage temp[0].pos[1]
					execute store result score #z homes.dummy run data get storage homes:storage temp[0].pos[2]
					execute if entity @s[tag=homes.nameSet] run tellraw @s [{"score":{"name":"#id","objective":"homes.dummy"},"color":"dark_aqua"},{"text":". ","color":"dark_aqua"},{"storage":"homes:storage","nbt":"temp[0].name","interpret":true,"color":"aqua"},{"text":" at (","color":"dark_aqua"},{"score":{"name":"#x","objective":"homes.dummy"},"color":"dark_aqua"},{"text":", ","color":"dark_aqua"},{"score":{"name":"#y","objective":"homes.dummy"},"color":"dark_aqua"},{"text":", ","color":"dark_aqua"},{"score":{"name":"#z","objective":"homes.dummy"},"color":"dark_aqua"},{"text":") in ","color":"dark_aqua"},{"entity":"@e[type=minecraft:item_frame,tag=homes.target,limit=1]","nbt":"Item.tag.homesData.name","color":"dark_aqua"}]
					execute unless entity @s[tag=homes.nameSet] if score #id homes.dummy matches 1 run tellraw @s [{"text":"1. ","color":"dark_aqua"},{"text":"Home","color":"aqua"},{"text":" at (","color":"dark_aqua"},{"score":{"name":"#x","objective":"homes.dummy"},"color":"dark_aqua"},{"text":", ","color":"dark_aqua"},{"score":{"name":"#y","objective":"homes.dummy"},"color":"dark_aqua"},{"text":", ","color":"dark_aqua"},{"score":{"name":"#z","objective":"homes.dummy"},"color":"dark_aqua"},{"text":") in ","color":"dark_aqua"},{"entity":"@e[type=minecraft:item_frame,tag=homes.target,limit=1]","nbt":"Item.tag.homesData.name","color":"dark_aqua"}]
					execute unless entity @s[tag=homes.nameSet] unless score #id homes.dummy matches 1 run tellraw @s [{"score":{"name":"#id","objective":"homes.dummy"},"color":"dark_aqua"},{"text":". ","color":"dark_aqua"},{"text":"Home ","color":"aqua"},{"score":{"name":"#id","objective":"homes.dummy"},"color":"aqua"},{"text":" at (","color":"dark_aqua"},{"score":{"name":"#x","objective":"homes.dummy"},"color":"dark_aqua"},{"text":", ","color":"dark_aqua"},{"score":{"name":"#y","objective":"homes.dummy"},"color":"dark_aqua"},{"text":", ","color":"dark_aqua"},{"score":{"name":"#z","objective":"homes.dummy"},"color":"dark_aqua"},{"text":") in ","color":"dark_aqua"},{"entity":"@e[type=minecraft:item_frame,tag=homes.target,limit=1]","nbt":"Item.tag.homesData.name","color":"dark_aqua"}]
				}
				tag @s remove homes.nameSet
				tag @e[type=minecraft:item_frame,tag=homes.dimension] remove homes.target
				data remove storage homes:storage temp[0]
				execute store result score #remaining homes.dummy run scoreboard players remove #homes homes.dummy 1
				data modify storage homes:storage temp set from storage homes:storage temp2
				data modify storage homes:storage temp2 set value []
				execute unless score #homes homes.dummy matches 0 run function $block
			}
		}
		scoreboard players set @s homes 0
	}
	scoreboard players enable @a home
	execute as @a[scores={home=1..}] run {
		name trigger_home
		execute if score @s homes.cooldown matches 1.. run tellraw @s [{"text":"Your Homes cooldown will end in ","color":"red"},{"score":{"name":"@s","objective":"homes.cooldown"},"color":"red"},{"text":" seconds.","color":"red"}]
		execute unless score @s homes.cooldown matches 1.. run {
			name try_to_start_to_go_home
			function homes:rotate/players
			scoreboard players operation #home homes.dummy = @s home
			function homes:rotate/homes
			execute if score #remaining homes.dummy matches 0 run tellraw @s [{"text":"Home ","color":"red"},{"score":{"name":"#home","objective":"homes.dummy"},"color":"red"},{"text":" not found.","color":"red"}]
			execute unless score #remaining homes.dummy matches 0 run {
				name start_to_go_home
				scoreboard players operation @s homes.target = #home homes.dummy
				scoreboard players operation @s homes.delay = #delay homes.config
				execute store result score @s homes.x run data get entity @s Pos[0] 10
				execute store result score @s homes.y run data get entity @s Pos[1] 10
				execute store result score @s homes.z run data get entity @s Pos[2] 10
				execute if data storage homes:storage players[-1].homes[-1].name run tag @s add homes.nameSet
				execute if entity @s[tag=homes.nameSet] run tellraw @s [{"text":"Teleporting to ","color":"dark_aqua"},{"storage":"homes:storage","nbt":"players[-1].homes[-1].name","interpret":true,"color":"aqua"},{"text":"...","color":"dark_aqua"}]
				execute unless entity @s[tag=homes.nameSet] if score #home homes.dummy matches 1 run tellraw @s [{"text":"Teleporting to ","color":"dark_aqua"},{"text":"Home","color":"aqua"},{"text":"...","color":"dark_aqua"}]
				execute unless entity @s[tag=homes.nameSet] unless score #home homes.dummy matches 1 run tellraw @s [{"text":"Teleporting to ","color":"dark_aqua"},{"text":"Home ","color":"aqua"},{"score":{"name":"#home","objective":"homes.dummy"},"color":"aqua"},{"text":"...","color":"dark_aqua"}]
				tag @s remove homes.nameSet
			}
		}
		scoreboard players set @s home 0
	}
	scoreboard players enable @a namehome
	execute as @a[scores={namehome=1..}] run {
		name trigger_namehome
		tag @s[nbt={SelectedItem:{id:"minecraft:name_tag",Count:1b}}] add homes.hasNameTag
		execute if entity @s[tag=homes.hasNameTag] run {
			name try_to_name_home
			function homes:rotate/players
			scoreboard players operation #home homes.dummy = @s namehome
			function homes:rotate/homes
			execute if score #remaining homes.dummy matches 0 run tellraw @s [{"text":"Home ","color":"red"},{"score":{"name":"#home","objective":"homes.dummy"},"color":"red"},{"text":" not found.","color":"red"}]
			execute unless score #remaining homes.dummy matches 0 run {
				name name_home
				execute if data entity @s SelectedItem.tag.display.Name run tag @s add homes.nameTagSet
				execute if data storage homes:storage players[-1].homes[-1].name run tag @s add homes.nameSet
				execute if entity @s[tag=homes.nameTagSet] run {
					name try_to_set_home_name
					data modify storage homes:storage temp set from storage homes:storage players[-1].homes[-1].name
					execute store success score #success homes.dummy run data modify storage homes:storage temp set from entity @s SelectedItem.tag.display.Name
					execute if score #success homes.dummy matches 1 run {
						name set_home_name
						execute if data storage homes:storage players[-1].homes[-1].name run tag @s add homes.nameSet
						execute if entity @s[tag=homes.nameSet] run tellraw @s [{"storage":"homes:storage","nbt":"players[-1].homes[-1].name","interpret":true,"color":"aqua"},{"text":" name set to ","color":"dark_aqua"},{"entity":"@s","nbt":"SelectedItem.tag.display.Name","interpret":true,"color":"aqua"},{"text":".","color":"dark_aqua"}]
						execute unless entity @s[tag=homes.nameSet] if score #home homes.dummy matches 1 run tellraw @s [{"text":"Home","color":"aqua"},{"text":" name set to ","color":"dark_aqua"},{"entity":"@s","nbt":"SelectedItem.tag.display.Name","interpret":true,"color":"aqua"},{"text":".","color":"dark_aqua"}]
						execute unless entity @s[tag=homes.nameSet] unless score #home homes.dummy matches 1 run tellraw @s [{"text":"Home ","color":"aqua"},{"score":{"name":"#home","objective":"homes.dummy"},"color":"aqua"},{"text":" name set to ","color":"dark_aqua"},{"entity":"@s","nbt":"SelectedItem.tag.display.Name","interpret":true,"color":"aqua"},{"text":".","color":"dark_aqua"}]
						tag @s remove homes.nameSet
						data modify storage homes:storage players[-1].homes[-1].name set from entity @s SelectedItem.tag.display.Name
						replaceitem entity @s weapon.mainhand minecraft:air
					}
					execute unless score #success homes.dummy matches 1 run tellraw @s {"text":"Your home is already named that.","color":"red"}
				}
				execute unless entity @s[tag=homes.nameTagSet] run {
					name try_to_reset_home_name
					execute if entity @s[tag=homes.nameSet] run {
						name reset_home_name
						execute if entity @s[tag=homes.nameSet] if score #home homes.dummy matches 1 run tellraw @s [{"storage":"homes:storage","nbt":"players[-1].homes[-1].name","interpret":true,"color":"aqua"},{"text":" name reset to ","color":"dark_aqua"},{"text":"Home","color":"aqua"},{"text":".","color":"dark_aqua"}]
						execute if entity @s[tag=homes.nameSet] unless score #home homes.dummy matches 1 run tellraw @s [{"storage":"homes:storage","nbt":"players[-1].homes[-1].name","interpret":true,"color":"aqua"},{"text":" name reset to ","color":"dark_aqua"},{"text":"Home ","color":"aqua"},{"score":{"name":"#home","objective":"homes.dummy"},"color":"aqua"},{"text":".","color":"dark_aqua"}]
						execute unless entity @s[tag=homes.nameSet] if score #home homes.dummy matches 1 run tellraw @s [{"text":"Home","color":"aqua"},{"text":" name reset to ","color":"dark_aqua"},{"text":"Home","color":"aqua"},{"text":".","color":"dark_aqua"}]
						data remove storage homes:storage players[-1].homes[-1].name
						replaceitem entity @s weapon.mainhand minecraft:air
					}
					tellraw @s[tag=!homes.nameSet] {"text":"You must rename the name tag to name your home.","color":"red"}
				}
				tag @s remove homes.nameSet
				tag @s remove homes.nameTagSet
			}
		}
		tellraw @s[tag=!homes.hasNameTag] {"text":"You must be holding exactly one name tag in your main hand to name a home.","color":"red"}
		tag @s remove homes.hasNameTag
		scoreboard players set @s namehome 0
	}
	execute as @a[scores={homes.target=1..}] run {
		name try_to_try_to_try_to_go_home
		execute if score @s homes.delay matches 0 run {
			name try_to_try_to_go_home
			function homes:rotate/players
			scoreboard players operation #home homes.dummy = @s homes.target
			scoreboard players set #success homes.dummy 0
			execute store result score #value homes.dummy run data get entity @s Pos[1] 10
			execute if score #value homes.dummy = @s homes.y run {
				name check_x
				execute store result score #value homes.dummy run data get entity @s Pos[0] 10
				execute if score #value homes.dummy = @s homes.x run {
					name check_z
					execute store result score #value homes.dummy run data get entity @s Pos[2] 10
					execute store success score #success homes.dummy if score #value homes.dummy = @s homes.z
				}
			}
			scoreboard players reset @s homes.x
			scoreboard players reset @s homes.y
			scoreboard players reset @s homes.z
			execute if score #success homes.dummy matches 0 run tellraw @s [{"text":"You must stand still to teleport.","color":"red"}]
			execute unless score #success homes.dummy matches 0 run {
				name try_to_go_home
				function homes:rotate/homes
				execute if score #remaining homes.dummy matches 0 run tellraw @s [{"text":"Home ","color":"red"},{"score":{"name":"#home","objective":"homes.dummy"},"color":"red"},{"text":" not found.","color":"red"}]
				execute unless score #remaining homes.dummy matches 0 run {
					name go_home
					execute store result score #dimension homes.dummy run data get storage homes:storage players[-1].homes[-1].dim
					execute as @e[type=minecraft:item_frame,tag=homes.dimension] run {
						name try_to_summon_destination
						execute store result score #id homes.dummy run data get entity @s Item.tag.homesData.id
						execute if score #id homes.dummy = #dimension homes.dummy at @s run summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["homes.destination"]}
					}
					execute unless score #cooldown homes.config matches 0 run scoreboard players operation @s homes.cooldown = #cooldown homes.config
					execute at @s run function back:set_back
					tag @s add homes.subject
					execute as @e[type=minecraft:area_effect_cloud,tag=homes.destination] run {
						name set_destination
						data modify entity @s Pos set from storage homes:storage players[-1].homes[-1].pos
						data modify entity @s Rotation set from storage homes:storage players[-1].homes[-1].rot
						tp @a[tag=homes.subject] @s
						kill @s
					}
					tag @s remove homes.subject
				}
			}
			scoreboard players reset @s homes.delay
			scoreboard players reset @s homes.target
		}
		execute unless score @s homes.delay matches 0 run scoreboard players remove @s homes.delay 1
	}
}
clock 1s {
	name decrement_cooldowns
	execute as @a[scores={homes.cooldown=1..}] run {
		name decrement_cooldown
		scoreboard players remove @s homes.cooldown 1
		execute if score @s homes.cooldown matches 0 run scoreboard players reset @s homes.cooldown
	}
}
function bubble {
	execute if score #id1 homes.dummy matches 0 store result score #id1 homes.dummy run data get storage homes:storage temp[-1].id
	execute if score #id2 homes.dummy matches 0 store result score #id2 homes.dummy run data get storage homes:storage temp[-2].id
	execute if score #id1 homes.dummy > #id2 homes.dummy run {
		name bubble_1
		data modify storage homes:storage temp2 append from storage homes:storage temp[-1]
		data remove storage homes:storage temp[-1]
		scoreboard players operation #id1 homes.dummy = #id2 homes.dummy
		scoreboard players set #id2 homes.dummy 0
	}
	execute if score #id2 homes.dummy > #id1 homes.dummy run {
		name bubble_2
		data modify storage homes:storage temp2 append from storage homes:storage temp[-2]
		data remove storage homes:storage temp[-2]
		scoreboard players set #id2 homes.dummy 0
	}
	scoreboard players remove #remaining homes.dummy 1
	execute unless score #remaining homes.dummy matches 1 run function $block
}
dir rotate {
	function homes {
		execute store result score #homes homes.dummy run data get storage homes:storage players[-1].homes
		scoreboard players operation #remaining homes.dummy = #homes homes.dummy
		execute store result score #id homes.dummy run data get storage homes:storage players[-1].homes[-1].id
		execute unless score #remaining homes.dummy matches 0 unless score #id homes.dummy = #home homes.dummy run function homes:rotate/home
	}
	function home {
		data modify storage homes:storage players[-1].homes prepend from storage homes:storage players[-1].homes[-1]
		data remove storage homes:storage players[-1].homes[-1]
		scoreboard players remove #remaining homes.dummy 1
		execute store result score #id homes.dummy run data get storage homes:storage players[-1].homes[-1].id
		execute unless score #remaining homes.dummy matches 0 unless score #id homes.dummy = #home homes.dummy run function $block
	}
	function players {
		execute store result score #remaining homes.dummy run data get storage homes:storage players
		data modify storage homes:storage temp set from entity @s UUID
		execute store success score #success homes.dummy run data modify storage homes:storage temp set from storage homes:storage players[-1].uuid
		execute unless score #remaining homes.dummy matches 0 if score #success homes.dummy matches 1 run function homes:rotate/player
		execute if score #remaining homes.dummy matches 0 run {
			name add_player
			data modify storage homes:storage players append value {homes:[]}
			data modify storage homes:storage players[-1].uuid set from entity @s UUID
		}
	}
	function player {
		data modify storage homes:storage players prepend from storage homes:storage players[-1]
		data remove storage homes:storage players[-1]
		scoreboard players remove #remaining homes.dummy 1
		data modify storage homes:storage temp set from entity @s UUID
		execute store success score #success homes.dummy run data modify storage homes:storage temp set from storage homes:storage players[-1].uuid
		execute unless score #remaining homes.dummy matches 0 if score #success homes.dummy matches 1 run function $block
	}
}
function config {
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	tellraw @s ["                         Homes",{"text":" / ","color":"gray"},"Global Settings                         "]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #limit homes.config "},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enter the maximum number of homes allowed per player.","color":"gray"},{"text":"\nAccepts: whole numbers 0+\nDefault: 1","color":"dark_gray"}]}}," Max Home Limit ",{"text":"(Current: ","color":"gray"},{"score":{"name":"#limit","objective":"homes.config"},"color":"gray"},{"text":")","color":"gray"}]
	tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #delay homes.config "},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enter the number of ticks required to stand still after running the home command.\n1 second = 20 ticks","color":"gray"},{"text":"\nAccepts: whole numbers 0+\nDefault: 0","color":"dark_gray"}]}}," Delay ",{"text":"(Current: ","color":"gray"},{"score":{"name":"#delay","objective":"homes.config"},"color":"gray"},{"text":")","color":"gray"}]
	tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #cooldown homes.config "},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enter the number of seconds required to wait between uses of the home command.","color":"gray"},{"text":"\nAccepts: whole numbers 0+\nDefault: 0","color":"dark_gray"}]}}," Cooldown ",{"text":"(Current: ","color":"gray"},{"score":{"name":"#cooldown","objective":"homes.config"},"color":"gray"},{"text":")","color":"gray"}]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	execute store result score #sendCommandFeedback homes.config run gamerule sendCommandFeedback
	execute if score #sendCommandFeedback homes.config matches 1 run {
		name hide_command_feedback
		gamerule sendCommandFeedback false
		schedule 1t replace {
			name restore_command_feedback
			gamerule sendCommandFeedback true
		}
	}
}
