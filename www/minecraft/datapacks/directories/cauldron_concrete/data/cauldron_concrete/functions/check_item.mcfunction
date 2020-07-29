tag @s add cauCon.subject
data modify entity a093751a-2c77-4658-9d5f-62ab4494bdaf HandItems[0] set from entity @s Item
execute as a093751a-2c77-4658-9d5f-62ab4494bdaf if predicate cauldron_concrete:concrete_powder as @e[type=minecraft:item,tag=cauCon.subject] run function cauldron_concrete:harden
tag @s remove cauCon.subject