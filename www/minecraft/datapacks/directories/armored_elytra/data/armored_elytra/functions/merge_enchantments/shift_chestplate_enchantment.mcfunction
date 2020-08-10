scoreboard players set #found armEly.dummy 0
scoreboard players operation #elytraRemaining armEly.dummy = #elytraTotal armEly.dummy
execute unless score #elytraTotal armEly.dummy matches 0 run function armored_elytra:merge_enchantments/check_elytra_enchantment
execute if score #found armEly.dummy matches 0 run function armored_elytra:merge_enchantments/add_enchantment_from_chestplate
scoreboard players remove #chestplateRemaining armEly.dummy 1
execute unless score #chestplateRemaining armEly.dummy matches 0 run function armored_elytra:merge_enchantments/shift_chestplate_enchantment