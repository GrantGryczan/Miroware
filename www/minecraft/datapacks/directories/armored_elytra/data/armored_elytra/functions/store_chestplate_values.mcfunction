execute store result score #chestplateValue armEly.dummy run data get entity @s Item.tag.RepairCost
data modify storage armored_elytra:storage chestplateEnch set value []
data modify storage armored_elytra:storage chestplateEnch set from entity @s Item.tag.Enchantments
execute store result score #chestplateTotal armEly.dummy run data get storage armored_elytra:storage chestplateEnch