scoreboard players set #found armEly.dummy 1
data modify storage armored_elytra:storage chestplateFinalEnch append from storage armored_elytra:storage item.tag.Enchantments[0]
data remove storage armored_elytra:storage chestplateEnch[0]
scoreboard players remove #chestplateTotal armEly.dummy 1