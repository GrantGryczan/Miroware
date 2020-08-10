advancement revoke @s only armored_elytra:break_armored_elytra
tag @s add armEly.subject
data modify storage armored_elytra:storage item set from entity @s Inventory[{Slot:102b}]
data modify storage armored_elytra:storage item.tag.Damage set value 431
function armored_elytra:separate_enchantments/start
execute as @e[type=minecraft:item,tag=armEly.separated] run function armored_elytra:set_owner
replaceitem entity @s armor.chest minecraft:air
tag @s remove armEly.subject