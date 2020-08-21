execute unless score @s duraPing.config matches 0.. run scoreboard players operation @s duraPing.config = #default duraPing.config
execute if score @s duraPing matches 8 run function durability_ping:trigger/enable_weapon
execute if score @s duraPing matches 7 run function durability_ping:trigger/disable_weapon
execute if score @s duraPing matches 10 run function durability_ping:trigger/enable_armor
execute if score @s duraPing matches 9 run function durability_ping:trigger/disable_armor
execute if score @s duraPing matches 11 run function durability_ping:trigger/toggle_sound
execute if score @s duraPing matches 12.. run function durability_ping:trigger/set_display
scoreboard players set @s duraPing 1