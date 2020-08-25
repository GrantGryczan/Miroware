execute if score @s duraPing matches 7.. run function durability_ping:trigger/use_config
execute if score @s duraPing matches 1 run function durability_ping:trigger/config
execute as @s[scores={duraPing=2}] at @s run playsound minecraft:block.anvil.land master @s ~ ~ ~ 1 2
execute if score @s duraPing matches 3 run function durability_ping:trigger/preview_display_subtitle
execute if score @s duraPing matches 4 run function durability_ping:trigger/preview_display_title
tellraw @s[scores={duraPing=5}] [{"translate":"item.minecraft.diamond_pickaxe","color":"gold"},{"text":" durability low! ","color":"red"},{"text":"156","color":"gold"},{"text":" of 1561 remaining.","color":"red"}]
title @s[scores={duraPing=6}] actionbar [{"translate":"item.minecraft.diamond_pickaxe","color":"gold"},{"text":" durability low! ","color":"red"},{"text":"156","color":"gold"},{"text":" of 1561 remaining.","color":"red"}]
scoreboard players set @s duraPing 0
scoreboard players enable @s duraPing