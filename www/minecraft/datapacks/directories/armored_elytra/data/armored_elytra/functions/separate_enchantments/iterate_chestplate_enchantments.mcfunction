data modify storage armored_elytra:storage temp set from storage armored_elytra:storage elytraEnch[0].id
execute store success score #success armEly.dummy run data modify storage armored_elytra:storage temp set from storage armored_elytra:storage chestplateEnch[0].id
execute if score #success armEly.dummy matches 0 run function armored_elytra:separate_enchantments/compare_levels
execute unless score #success armEly.dummy matches 0 run function armored_elytra:separate_enchantments/rotate_chestplate_enchantment