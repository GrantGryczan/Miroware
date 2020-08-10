tag @s add armEly.chestplate
data modify entity 291dfbec-2b7b-4c2b-9899-f665ea53af5d HandItems[0] set from entity @s Item
execute as 291dfbec-2b7b-4c2b-9899-f665ea53af5d if predicate armored_elytra:chestplate as @e[type=minecraft:item,tag=armEly.subject] run function armored_elytra:try_to_armor_elytra
tag @s remove armEly.chestplate