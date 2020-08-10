summon minecraft:item ~ ~ ~ {Tags:["armEly.separated","armEly.elytra"],Item:{id:"minecraft:elytra",Count:1b}}
summon minecraft:item ~ ~ ~ {Tags:["armEly.separated","armEly.chestplate"],Item:{id:"minecraft:chainmail_chestplate",Count:1b}}
data modify storage armored_elytra:storage elytraEnch set from entity @s Item.tag.armElyData.elytra.tag.Enchantments
data modify storage armored_elytra:storage chestplateEnch set from entity @s Item.tag.armElyData.chestplate.tag.Enchantments
execute store result score #elytraTotal armEly.dummy run data get storage armored_elytra:storage elytraEnch
execute store result score #chestplateTotal armEly.dummy run data get storage armored_elytra:storage chestplateEnch
execute unless score #elytraTotal armEly.dummy matches 0 unless score #chestplateTotal armEly.dummy matches 0 run function armored_elytra:separate_enchantments/start_to_iterate
data modify storage armored_elytra:storage ench set from entity @s Item.tag.Enchantments
execute store result score #remaining armEly.dummy run data get storage armored_elytra:storage ench
execute unless score #remaining armEly.dummy matches 0 run function armored_elytra:separate_enchantments/shift_enchantment
data modify storage armored_elytra:storage temp set from entity @s Item.tag.armElyData
data modify storage armored_elytra:storage temp.elytra.tag.Enchantments set from storage armored_elytra:storage elytraFinalEnch
execute unless data storage armored_elytra:storage elytraFinalEnch run data remove storage armored_elytra:storage temp.elytra.tag.Enchantments
data modify storage armored_elytra:storage temp.chestplate.tag.Enchantments set from storage armored_elytra:storage chestplateFinalEnch
execute unless data storage armored_elytra:storage chestplateFinalEnch run data remove storage armored_elytra:storage temp.chestplate.tag.Enchantments
data modify entity @e[type=minecraft:item,tag=armEly.elytra,limit=1] Item set from storage armored_elytra:storage temp.elytra
data modify entity @e[type=minecraft:item,tag=armEly.chestplate,limit=1] Item set from storage armored_elytra:storage temp.chestplate
data remove storage armored_elytra:storage elytraFinalEnch
data remove storage armored_elytra:storage chestplateFinalEnch
tag @e[type=minecraft:item] remove armEly.elytra
tag @e[type=minecraft:item] remove armEly.chestplate