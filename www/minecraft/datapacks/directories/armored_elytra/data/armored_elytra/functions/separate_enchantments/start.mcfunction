summon minecraft:item ~ ~ ~ {Tags:["armEly.separated","armEly.elytra"],Item:{id:"minecraft:elytra",Count:1b}}
summon minecraft:item ~ ~ ~ {Tags:["armEly.separated","armEly.chestplate"],Item:{id:"minecraft:chainmail_chestplate",Count:1b}}
data modify storage armored_elytra:storage elytraEnch set from storage armored_elytra:storage item.tag.armElyData.elytra.tag.Enchantments
data modify storage armored_elytra:storage chestplateEnch set from storage armored_elytra:storage item.tag.armElyData.chestplate.tag.Enchantments
execute store result score #elytraTotal armEly.dummy run data get storage armored_elytra:storage elytraEnch
execute store result score #chestplateTotal armEly.dummy run data get storage armored_elytra:storage chestplateEnch
execute unless score #elytraTotal armEly.dummy matches 0 unless score #chestplateTotal armEly.dummy matches 0 run function armored_elytra:separate_enchantments/start_to_iterate
execute store result score #remaining armEly.dummy run data get storage armored_elytra:storage item.tag.Enchantments
execute unless score #remaining armEly.dummy matches 0 run function armored_elytra:separate_enchantments/shift_enchantment
execute store success score #success armEly.dummy if data storage armored_elytra:storage elytraFinalEnch
execute if score #success armEly.dummy matches 1 run data modify storage armored_elytra:storage item.tag.armElyData.elytra.tag.Enchantments set from storage armored_elytra:storage elytraFinalEnch
execute unless score #success armEly.dummy matches 1 run data remove storage armored_elytra:storage item.tag.armElyData.elytra.tag.Enchantments
execute store success score #success armEly.dummy if data storage armored_elytra:storage chestplateFinalEnch
execute if score #success armEly.dummy matches 1 run data modify storage armored_elytra:storage item.tag.armElyData.chestplate.tag.Enchantments set from storage armored_elytra:storage chestplateFinalEnch
execute unless score #success armEly.dummy matches 1 run data remove storage armored_elytra:storage item.tag.armElyData.chestplate.tag.Enchantments
execute store success score #success armEly.dummy if data storage armored_elytra:storage item.tag.Damage
execute if score #success armEly.dummy matches 1 run data modify storage armored_elytra:storage item.tag.armElyData.elytra.tag.Damage set from storage armored_elytra:storage item.tag.Damage
execute unless score #success armEly.dummy matches 1 run data remove storage armored_elytra:storage item.tag.armElyData.elytra.tag.Damage
execute store success score #success armEly.dummy if data storage armored_elytra:storage item.tag.display.Name
execute if score #success armEly.dummy matches 1 run data modify storage armored_elytra:storage item.tag.armElyData.elytra.tag.display.Name set from storage armored_elytra:storage item.tag.display.Name
execute unless score #success armEly.dummy matches 1 run data remove storage armored_elytra:storage item.tag.armElyData.elytra.tag.display.Name
data modify entity @e[type=minecraft:item,tag=armEly.elytra,limit=1] Item set from storage armored_elytra:storage item.tag.armElyData.elytra
data modify entity @e[type=minecraft:item,tag=armEly.chestplate,limit=1] Item set from storage armored_elytra:storage item.tag.armElyData.chestplate
data remove storage armored_elytra:storage elytraFinalEnch
data remove storage armored_elytra:storage chestplateFinalEnch
tag @e[type=minecraft:item] remove armEly.elytra
tag @e[type=minecraft:item] remove armEly.chestplate