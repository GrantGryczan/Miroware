data modify storage armored_elytra:storage finalEnch append from storage armored_elytra:storage elytraEnch[-1]
data remove storage armored_elytra:storage elytraEnch[-1]
scoreboard players remove #elytraTotal armEly.dummy 1
execute unless score #elytraTotal armEly.dummy matches 0 run function armored_elytra:merge_enchantments/add_enchantment_from_elytra