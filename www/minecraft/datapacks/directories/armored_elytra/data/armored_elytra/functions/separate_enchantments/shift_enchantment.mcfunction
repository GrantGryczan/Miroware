scoreboard players set #found armEly.dummy 0
execute unless score #chestplateTotal armEly.dummy matches 0 run function armored_elytra:separate_enchantments/check_chestplate_enchantments
execute if score #found armEly.dummy matches 0 run data modify storage armored_elytra:storage elytraFinalEnch append from storage armored_elytra:storage item.tag.Enchantments[0]
data remove storage armored_elytra:storage item.tag.Enchantments[0]
scoreboard players remove #remaining armEly.dummy 1
execute unless score #remaining armEly.dummy matches 0 run function armored_elytra:separate_enchantments/shift_enchantment