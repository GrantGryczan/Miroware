execute store result score #elytraValue armEly.dummy run data get storage armored_elytra:storage elytraEnch[0].lvl
execute store result score #chestplateValue armEly.dummy run data get storage armored_elytra:storage chestplateEnch[0].lvl
execute if score #chestplateValue armEly.dummy > #elytraValue armEly.dummy run function armored_elytra:separate_enchantments/add_elytra_enchantment
execute unless score #chestplateValue armEly.dummy > #elytraValue armEly.dummy run function armored_elytra:separate_enchantments/add_chestplate_enchantment