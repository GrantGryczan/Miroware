data modify storage armored_elytra:storage chestplateEnch append from storage armored_elytra:storage chestplateEnch[0]
data remove storage armored_elytra:storage chestplateEnch[0]
scoreboard players remove #chestplateRemaining armEly.dummy 1
execute unless score #chestplateRemaining armEly.dummy matches 0 run function armored_elytra:separate_enchantments/check_chestplate_enchantment