data modify storage armored_elytra:storage elytraEnch append from storage armored_elytra:storage elytraEnch[0]
data remove storage armored_elytra:storage elytraEnch[0]
scoreboard players remove #elytraRemaining armEly.dummy 1
execute unless score #elytraRemaining armEly.dummy matches 0 run function armored_elytra:separate_enchantments/iterate_elytra_enchantments