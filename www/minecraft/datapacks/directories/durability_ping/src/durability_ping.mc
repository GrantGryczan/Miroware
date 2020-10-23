function load {
	scoreboard objectives add duraPing.config dummy "Durability Ping Config"
	scoreboard objectives add duraPing.dummy dummy
	scoreboard objectives add duraPing trigger "Durability Ping"
	scoreboard objectives add duraPing.weapon dummy
	scoreboard objectives add duraPing.armor dummy
	scoreboard players set #10 duraPing.dummy 10
	scoreboard players set #100 duraPing.dummy 100
	execute unless score #default duraPing.config matches 0.. run scoreboard players set #default duraPing.config 11
	LOOP (config.data.items, item) {
		advancement revoke @a only durability_ping:damage/<% item.id %>
	}
}
function uninstall {
	schedule clear durability_ping:tick
	schedule clear durability_ping:schedule
	scoreboard objectives remove duraPing.config
	scoreboard objectives remove duraPing.dummy
	scoreboard objectives remove duraPing
	scoreboard objectives remove duraPing.weapon
	scoreboard objectives remove duraPing.armor
	data remove storage durability_ping:storage name
}
clock 1t {
	name tick
	execute as @a[scores={duraPing=1..}] run {
		name trigger
		execute if score @s duraPing matches 7.. run {
			name trigger/use_config
			execute unless score @s duraPing.config matches 0.. run scoreboard players operation @s duraPing.config = #default duraPing.config
			execute if score @s duraPing matches 8 run {
				name trigger/enable_weapon
				execute if score @s duraPing.config matches 100..199 run scoreboard players remove @s duraPing.config 100
				execute if score @s duraPing.config matches 200..299 run scoreboard players add @s duraPing.config 100
			}
			execute if score @s duraPing matches 7 run {
				name trigger/disable_weapon
				execute if score @s duraPing.config matches ..99 run scoreboard players add @s duraPing.config 100
				execute if score @s duraPing.config matches 300..399 run scoreboard players remove @s duraPing.config 100
			}
			execute if score @s duraPing matches 10 run {
				name trigger/enable_armor
				execute if score @s duraPing.config matches 200..299 run scoreboard players remove @s duraPing.config 100
				execute if score @s duraPing.config matches 300..399 run scoreboard players remove @s duraPing.config 300
			}
			execute if score @s duraPing matches 9 run {
				name trigger/disable_armor
				execute if score @s duraPing.config matches ..99 run scoreboard players add @s duraPing.config 300
				execute if score @s duraPing.config matches 100..199 run scoreboard players add @s duraPing.config 100
			}
			execute if score @s duraPing matches 11 run {
				name trigger/toggle_sound
				scoreboard players operation #config duraPing.dummy = @s duraPing.config
				scoreboard players operation #config duraPing.dummy %= #100 duraPing.dummy
				execute if score #config duraPing.dummy matches 10.. run scoreboard players remove @s duraPing.config 10
				execute unless score #config duraPing.dummy matches 10.. run scoreboard players add @s duraPing.config 10
			}
			execute if score @s duraPing matches 12.. run {
				name trigger/set_display
				scoreboard players operation @s duraPing.config /= #10 duraPing.dummy
				scoreboard players operation @s duraPing.config *= #10 duraPing.dummy
				execute if score @s duraPing matches 13 run scoreboard players add @s duraPing.config 1
				execute if score @s duraPing matches 14 run scoreboard players add @s duraPing.config 2
				execute if score @s duraPing matches 15 run scoreboard players add @s duraPing.config 3
				execute if score @s duraPing matches 16 run scoreboard players add @s duraPing.config 4
			}
			scoreboard players set @s duraPing 1
		}
		execute if score @s duraPing matches 1 run {
			name trigger/config
			scoreboard players operation #config duraPing.dummy = #default duraPing.config
			execute if score @s duraPing.config matches 0.. run scoreboard players operation #config duraPing.dummy = @s duraPing.config
			tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
			tellraw @s ["                  Durability Ping",{"text":" / ","color":"gray"},"Personal Settings                  "]
			tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
			execute if score #config duraPing.dummy matches 100..299 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/trigger duraPing set 8"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Ping for Hand Items",{"text":".","color":"green"},{"text":"\nIncludes any item with durability in the mainhand or offhand slots","color":"gray"}]}}," Ping for Hand Items"]
			execute unless score #config duraPing.dummy matches 100..299 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/trigger duraPing set 7"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Ping for Hand Items",{"text":".","color":"red"},{"text":"\nIncludes any item with durability in the mainhand or offhand slots","color":"gray"}]}}," Ping for Hand Items"]
			execute if score #config duraPing.dummy matches 200.. run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/trigger duraPing set 10"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Ping for Armor Items",{"text":".","color":"green"},{"text":"\nIncludes any item with durability in the armor slots","color":"gray"}]}}," Ping for Armor Items"]
			execute unless score #config duraPing.dummy matches 200.. run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/trigger duraPing set 9"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Ping for Armor Items",{"text":".","color":"red"},{"text":"\nIncludes any item with durability in the armor slots","color":"gray"}]}}," Ping for Armor Items"]
			scoreboard players operation #config duraPing.dummy %= #100 duraPing.dummy
			execute if score #config duraPing.dummy matches ..9 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/trigger duraPing set 11"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Ping with Sound",{"text":".","color":"green"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 2"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Ping with Sound",{"text":".","color":"dark_gray"}]}}," Ping with Sound"]
			execute unless score #config duraPing.dummy matches ..9 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/trigger duraPing set 11"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Ping with Sound",{"text":".","color":"red"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 2"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Ping with Sound",{"text":".","color":"dark_gray"}]}}," Ping with Sound"]
			scoreboard players operation #config duraPing.dummy %= #10 duraPing.dummy
			execute if score #config duraPing.dummy matches 0 run tellraw @s ["",{"text":"[ ✔ ]","color":"green"}," Display: Hidden"]
			execute unless score #config duraPing.dummy matches 0 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/trigger duraPing set 12"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Display: Hidden",{"text":".","color":"green"}]}}," Display: Hidden"]
			execute if score #config duraPing.dummy matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/trigger duraPing set 12"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Display: Subtitle",{"text":".","color":"red"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 3"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Display: Subtitle",{"text":".","color":"gray"}]}}," Display: Subtitle"]
			execute unless score #config duraPing.dummy matches 1 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/trigger duraPing set 13"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Display: Subtitle",{"text":".","color":"green"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 3"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Display: Subtitle",{"text":".","color":"gray"}]}}," Display: Subtitle"]
			execute if score #config duraPing.dummy matches 2 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/trigger duraPing set 12"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Display: Title",{"text":".","color":"red"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 4"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Display: Title",{"text":".","color":"gray"}]}}," Display: Title"]
			execute unless score #config duraPing.dummy matches 2 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/trigger duraPing set 14"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Display: Title",{"text":".","color":"green"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 4"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Display: Title",{"text":".","color":"gray"}]}}," Display: Title"]
			execute if score #config duraPing.dummy matches 3 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/trigger duraPing set 12"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Display: Chat",{"text":".","color":"red"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 5"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Display: Chat",{"text":".","color":"dark_gray"}]}}," Display: Chat"]
			execute unless score #config duraPing.dummy matches 3 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/trigger duraPing set 15"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Display: Chat",{"text":".","color":"green"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 5"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Display: Chat",{"text":".","color":"dark_gray"}]}}," Display: Chat"]
			execute if score #config duraPing.dummy matches 4 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/trigger duraPing set 12"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Display: Action Bar",{"text":".","color":"red"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 6"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Display: Action Bar",{"text":".","color":"gray"}]}}," Display: Action Bar"]
			execute unless score #config duraPing.dummy matches 4 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/trigger duraPing set 16"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Display: Action Bar",{"text":".","color":"green"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 6"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Display: Action Bar",{"text":".","color":"gray"}]}}," Display: Action Bar"]
			tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
		}
		execute as @s[scores={duraPing=2}] at @s run playsound minecraft:block.anvil.land master @s ~ ~ ~ 1 2
		execute if score @s duraPing matches 3 run {
			name trigger/preview_display_subtitle
			title @s reset
			title @s title ""
			title @s subtitle [{"translate":"item.minecraft.diamond_pickaxe","color":"gold"},{"text":" durability low! ","color":"red"},{"text":"156","color":"gold"},{"text":" of 1561 remaining.","color":"red"}]
		}
		execute if score @s duraPing matches 4 run {
			name trigger/preview_display_title
			title @s reset
			title @s title [{"translate":"item.minecraft.diamond_pickaxe","color":"gold"},{"text":" durability low!","color":"red"}]
			title @s subtitle [{"text":"156","color":"gold"},{"text":" of 1561 remaining.","color":"red"}]
		}
		tellraw @s[scores={duraPing=5}] [{"translate":"item.minecraft.diamond_pickaxe","color":"gold"},{"text":" durability low! ","color":"red"},{"text":"156","color":"gold"},{"text":" of 1561 remaining.","color":"red"}]
		title @s[scores={duraPing=6}] actionbar [{"translate":"item.minecraft.diamond_pickaxe","color":"gold"},{"text":" durability low! ","color":"red"},{"text":"156","color":"gold"},{"text":" of 1561 remaining.","color":"red"}]
		scoreboard players set @s duraPing 0
		scoreboard players enable @s duraPing
	}
}
clock 1s {
	name schedule
	scoreboard players enable @a duraPing
	execute as @a[scores={duraPing.weapon=1..}] run {
		name decrement_weapon_cooldown
		scoreboard players remove @s duraPing.weapon 1
		scoreboard players reset @s[scores={duraPing.weapon=0}] duraPing.weapon
	}
	execute as @a[scores={duraPing.armor=1..}] run {
		name decrement_armor_cooldown
		scoreboard players remove @s duraPing.armor 1
		scoreboard players reset @s[scores={duraPing.armor=0}] duraPing.armor
	}
}
function damage {
	schedule function durability_ping:check_damage 1t
}
function check_damage {
	LOOP (config.data.items, item) {
		execute as @a[advancements={durability_ping:damage/<% item.id %>=true}] run {
			name damage/<% item.id %>
			advancement revoke @s only durability_ping:damage/<% item.id %>
			scoreboard players set #durability duraPing.dummy <% item.durability %>
			data modify storage durability_ping:storage name set value '{"translate":"item.minecraft.<% item.id %>","color":"gold"}'
			!IF(item.slot === "weapon") {
				scoreboard players set @s duraPing.weapon 60
				execute store success score #mainhand duraPing.dummy if entity @s[nbt={SelectedItem:{id:"minecraft:<% item.id %>"}}]
				execute if score #mainhand duraPing.dummy matches 1 run data modify storage durability_ping:storage itemTag set from entity @s SelectedItem.tag
				execute unless score #mainhand duraPing.dummy matches 1 run data modify storage durability_ping:storage itemTag set from entity @s Inventory[{Slot:-106b}].tag
			}
			!IF(item.slot !== "weapon") {
				scoreboard players set @s duraPing.armor 60
				data modify storage durability_ping:storage itemTag set from entity @s Inventory[{Slot:<% config.data.slots[item.slot] %>b}].tag
			}
			execute store result score #damage duraPing.dummy run data get storage durability_ping:storage itemTag.Damage
			execute if data storage durability_ping:storage itemTag.display.Name run data modify storage durability_ping:storage name set value '{"storage":"durability_ping:storage","nbt":"itemTag.display.Name","interpret":true,"italic":true}'
			scoreboard players operation #durability duraPing.dummy -= #damage duraPing.dummy
			scoreboard players operation #config duraPing.dummy = #default duraPing.config
			execute if score @s duraPing.config matches 0.. run scoreboard players operation #config duraPing.dummy = @s duraPing.config
			scoreboard players operation #config duraPing.dummy %= #100 duraPing.dummy
			execute if score #config duraPing.dummy matches 10.. at @s run playsound minecraft:block.anvil.land master @s ~ ~ ~ 1 2
			scoreboard players operation #config duraPing.dummy %= #10 duraPing.dummy
			execute if score #config duraPing.dummy matches 1..2 run title @s reset
			execute if score #config duraPing.dummy matches 1 run title @s title ""
			execute if score #damage duraPing.dummy matches 0 if score #config duraPing.dummy matches 1 run title @s subtitle ["",{"storage":"durability_ping:storage","nbt":"name","interpret":true,"color":"gold"},{"text":" durability low!","color":"red"}]
			execute unless score #damage duraPing.dummy matches 0 if score #config duraPing.dummy matches 1 run title @s subtitle ["",{"storage":"durability_ping:storage","nbt":"name","interpret":true,"color":"gold"},{"text":" durability low! ","color":"red"},{"score":{"name":"#durability","objective":"duraPing.dummy"},"color":"gold"},{"text":" of <% item.durability %> remaining.","color":"red"}]
			execute if score #config duraPing.dummy matches 2 run title @s title ["",{"storage":"durability_ping:storage","nbt":"name","interpret":true,"color":"gold"},{"text":" durability low!","color":"red"}]
			execute unless score #damage duraPing.dummy matches 0 if score #config duraPing.dummy matches 2 run title @s subtitle [{"score":{"name":"#durability","objective":"duraPing.dummy"},"color":"gold"},{"text":" of <% item.durability %> remaining.","color":"red"}]
			execute if score #damage duraPing.dummy matches 0 if score #config duraPing.dummy matches 3 run tellraw @s ["",{"storage":"durability_ping:storage","nbt":"name","interpret":true,"color":"gold"},{"text":" durability low!","color":"red"}]
			execute unless score #damage duraPing.dummy matches 0 if score #config duraPing.dummy matches 3 run tellraw @s ["",{"storage":"durability_ping:storage","nbt":"name","interpret":true,"color":"gold"},{"text":" durability low! ","color":"red"},{"score":{"name":"#durability","objective":"duraPing.dummy"},"color":"gold"},{"text":" of <% item.durability %> remaining.","color":"red"}]
			execute if score #damage duraPing.dummy matches 0 if score #config duraPing.dummy matches 4 run title @s actionbar ["",{"storage":"durability_ping:storage","nbt":"name","interpret":true,"color":"gold"},{"text":" durability low!","color":"red"}]
			execute unless score #damage duraPing.dummy matches 0 if score #config duraPing.dummy matches 4 run title @s actionbar ["",{"storage":"durability_ping:storage","nbt":"name","interpret":true,"color":"gold"},{"text":" durability low! ","color":"red"},{"score":{"name":"#durability","objective":"duraPing.dummy"},"color":"gold"},{"text":" of <% item.durability %> remaining.","color":"red"}]
			data remove storage durability_ping:storage itemTag
		}
	}
}
function config {
	scoreboard players operation #config duraPing.dummy = #default duraPing.config
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	tellraw @s ["                    Durability Ping",{"text":" / ","color":"gray"},"Global Settings                    "]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	execute if score #config duraPing.dummy matches 100..299 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function durability_ping:config/enable_default_weapon"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Default Ping for Hand Items",{"text":".","color":"green"},{"text":"\nIncludes any item with durability in the mainhand or offhand slots","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," Default Ping for Hand Items"]
	execute unless score #config duraPing.dummy matches 100..299 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function durability_ping:config/disable_default_weapon"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Default Ping for Hand Items",{"text":".","color":"red"},{"text":"\nIncludes any item with durability in the mainhand or offhand slots","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," Default Ping for Hand Items"]
	execute if score #config duraPing.dummy matches 200.. run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function durability_ping:config/enable_default_armor"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Default Ping for Armor Items",{"text":".","color":"green"},{"text":"\nIncludes any item with durability in the armor slots","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," Default Ping for Armor Items"]
	execute unless score #config duraPing.dummy matches 200.. run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function durability_ping:config/disable_default_armor"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Default Ping for Armor Items",{"text":".","color":"red"},{"text":"\nIncludes any item with durability in the armor slots","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," Default Ping for Armor Items"]
	scoreboard players operation #config duraPing.dummy %= #100 duraPing.dummy
	execute if score #config duraPing.dummy matches ..9 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function durability_ping:config/toggle_default_sound"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Default Ping with Sound",{"text":".","color":"green"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 2"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Default Ping with Sound",{"text":".","color":"dark_gray"}]}}," Default Ping with Sound"]
	execute unless score #config duraPing.dummy matches ..9 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function durability_ping:config/toggle_default_sound"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Default Ping with Sound",{"text":".","color":"red"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 2"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Default Ping with Sound",{"text":".","color":"dark_gray"}]}}," Default Ping with Sound"]
	scoreboard players operation #config duraPing.dummy %= #10 duraPing.dummy
	execute if score #config duraPing.dummy matches 0 run tellraw @s ["",{"text":"[ ✔ ]","color":"green"}," Default Display: Hidden"]
	execute unless score #config duraPing.dummy matches 0 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function durability_ping:config/enable_default_display_hidden"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Default Display: Hidden",{"text":".","color":"green"}]}}," Default Display: Hidden"]
	execute if score #config duraPing.dummy matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function durability_ping:config/enable_default_display_hidden"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Default Display: Subtitle",{"text":".","color":"red"},{"text":"\nDefault","color":"dark_gray"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 3"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Default Display: Subtitle",{"text":".","color":"gray"}]}}," Default Display: Subtitle"]
	execute unless score #config duraPing.dummy matches 1 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function durability_ping:config/enable_default_display_subtitle"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Default Display: Subtitle",{"text":".","color":"green"},{"text":"\nDefault","color":"dark_gray"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 3"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Default Display: Subtitle",{"text":".","color":"gray"}]}}," Default Display: Subtitle"]
	execute if score #config duraPing.dummy matches 2 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function durability_ping:config/enable_default_display_hidden"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Default Display: Title",{"text":".","color":"red"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 4"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Default Display: Title",{"text":".","color":"gray"}]}}," Default Display: Title"]
	execute unless score #config duraPing.dummy matches 2 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function durability_ping:config/enable_default_display_title"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Default Display: Title",{"text":".","color":"green"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 4"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Default Display: Title",{"text":".","color":"gray"}]}}," Default Display: Title"]
	execute if score #config duraPing.dummy matches 3 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function durability_ping:config/enable_default_display_hidden"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Default Display: Chat",{"text":".","color":"red"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 5"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Default Display: Chat",{"text":".","color":"dark_gray"}]}}," Default Display: Chat"]
	execute unless score #config duraPing.dummy matches 3 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function durability_ping:config/enable_default_display_chat"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Default Display: Chat",{"text":".","color":"green"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 5"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Default Display: Chat",{"text":".","color":"dark_gray"}]}}," Default Display: Chat"]
	execute if score #config duraPing.dummy matches 4 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function durability_ping:config/enable_default_display_hidden"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to disable ","color":"red"},"Default Display: Action Bar",{"text":".","color":"red"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 6"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Default Display: Action Bar",{"text":".","color":"gray"}]}}," Default Display: Action Bar"]
	execute unless score #config duraPing.dummy matches 4 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function durability_ping:config/enable_default_display_action_bar"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to enable ","color":"green"},"Default Display: Action Bar",{"text":".","color":"green"}]}}," ",{"text":"[ ℹ ]","color":"gray","clickEvent":{"action":"run_command","value":"/trigger duraPing set 6"},"hoverEvent":{"action":"show_text","value":["",{"text":"Click to preview ","color":"gray"},"Default Display: Action Bar",{"text":".","color":"gray"}]}}," Default Display: Action Bar"]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	execute store result score #sendCommandFeedback duraPing.config run gamerule sendCommandFeedback
	execute if score #sendCommandFeedback duraPing.config matches 1 run {
		name hide_command_feedback
		gamerule sendCommandFeedback false
		schedule 1t replace {
			name restore_command_feedback
			gamerule sendCommandFeedback true
		}
	}
}
dir config {
	function enable_default_weapon {
		execute if score #default duraPing.config matches 100..199 run scoreboard players remove #default duraPing.config 100
		execute if score #default duraPing.config matches 200..299 run scoreboard players add #default duraPing.config 100
		function durability_ping:config
	}
	function disable_default_weapon {
		execute if score #default duraPing.config matches ..99 run scoreboard players add #default duraPing.config 100
		execute if score #default duraPing.config matches 300..399 run scoreboard players remove #default duraPing.config 100
		function durability_ping:config
	}
	function enable_default_armor {
		execute if score #default duraPing.config matches 200..299 run scoreboard players remove #default duraPing.config 100
		execute if score #default duraPing.config matches 300..399 run scoreboard players remove #default duraPing.config 300
		function durability_ping:config
	}
	function disable_default_armor {
		execute if score #default duraPing.config matches ..99 run scoreboard players add #default duraPing.config 300
		execute if score #default duraPing.config matches 100..199 run scoreboard players add #default duraPing.config 100
		function durability_ping:config
	}
	function toggle_default_sound {
		scoreboard players operation #config duraPing.dummy = #default duraPing.config
		scoreboard players operation #config duraPing.dummy %= #100 duraPing.dummy
		execute if score #config duraPing.dummy matches 10.. run scoreboard players remove #default duraPing.config 10
		execute unless score #config duraPing.dummy matches 10.. run scoreboard players add #default duraPing.config 10
		function durability_ping:config
	}
	function enable_default_display_hidden {
		scoreboard players operation #default duraPing.config /= #10 duraPing.dummy
		scoreboard players operation #default duraPing.config *= #10 duraPing.dummy
		function durability_ping:config
	}
	function enable_default_display_subtitle {
		scoreboard players operation #default duraPing.config /= #10 duraPing.dummy
		scoreboard players operation #default duraPing.config *= #10 duraPing.dummy
		scoreboard players add #default duraPing.config 1
		function durability_ping:config
	}
	function enable_default_display_title {
		scoreboard players operation #default duraPing.config /= #10 duraPing.dummy
		scoreboard players operation #default duraPing.config *= #10 duraPing.dummy
		scoreboard players add #default duraPing.config 2
		function durability_ping:config
	}
	function enable_default_display_chat {
		scoreboard players operation #default duraPing.config /= #10 duraPing.dummy
		scoreboard players operation #default duraPing.config *= #10 duraPing.dummy
		scoreboard players add #default duraPing.config 3
		function durability_ping:config
	}
	function enable_default_display_action_bar {
		scoreboard players operation #default duraPing.config /= #10 duraPing.dummy
		scoreboard players operation #default duraPing.config *= #10 duraPing.dummy
		scoreboard players add #default duraPing.config 4
		function durability_ping:config
	}
}
