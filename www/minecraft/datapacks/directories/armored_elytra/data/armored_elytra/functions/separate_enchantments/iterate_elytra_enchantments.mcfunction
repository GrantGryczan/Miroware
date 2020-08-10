scoreboard players operation #chestplateRemaining armEly.dummy = #chestplateTotal armEly.dummy
function armored_elytra:separate_enchantments/iterate_chestplate_enchantments
execute unless score #elytraTotal armEly.dummy matches 0 unless score #chestplateTotal armEly.dummy matches 0 run function armored_elytra:separate_enchantments/rotate_elytra_enchantment