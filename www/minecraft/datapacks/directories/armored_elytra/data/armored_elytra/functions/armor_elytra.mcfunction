data modify entity @s Item.tag.armElyData.elytra set from entity @s Item
scoreboard players set #found armEly.dummy 0
execute if entity @e[type=minecraft:item,tag=armEly.chestplate,nbt={Item:{id:"minecraft:netherite_chestplate"}}] run function armored_elytra:armor/netherite
execute if score #found armEly.dummy matches 0 if entity @e[type=minecraft:item,tag=armEly.chestplate,nbt={Item:{id:"minecraft:diamond_chestplate"}}] run function armored_elytra:armor/diamond
execute if score #found armEly.dummy matches 0 if entity @e[type=minecraft:item,tag=armEly.chestplate,nbt={Item:{id:"minecraft:iron_chestplate"}}] run function armored_elytra:armor/iron
execute if score #found armEly.dummy matches 0 if entity @e[type=minecraft:item,tag=armEly.chestplate,nbt={Item:{id:"minecraft:golden_chestplate"}}] run function armored_elytra:armor/gold
execute if score #found armEly.dummy matches 0 if entity @e[type=minecraft:item,tag=armEly.chestplate,nbt={Item:{id:"minecraft:chainmail_chestplate"}}] run function armored_elytra:armor/chain
execute if score #found armEly.dummy matches 0 if entity @e[type=minecraft:item,tag=armEly.chestplate,nbt={Item:{id:"minecraft:leather_chestplate"}}] run function armored_elytra:armor/leather
data modify entity @s Item.tag.armElyData.chestplate set from entity @e[type=minecraft:item,tag=armEly.chestplate,limit=1] Item
execute store success score #success armEly.dummy if data entity @s Item.tag.armElyData.chestplate.tag.display.Name
execute if score #success armEly.dummy matches 1 run loot spawn ~ 1000 ~ loot armored_elytra:named_lore
execute unless score #success armEly.dummy matches 1 run loot spawn ~ 1000 ~ loot armored_elytra:lore
tag @e[type=minecraft:item,nbt={Item:{tag:{armElyLore:1b}}}] add armEly.lore
data modify entity @s Item.tag.display.Lore append from entity @e[type=minecraft:item,tag=armEly.lore,limit=1] Item.tag.display.Lore[0]
kill @e[type=minecraft:item,tag=armEly.lore]
execute store result score #elytraValue armEly.dummy run data get entity @s Item.tag.RepairCost
data modify storage armored_elytra:storage elytraEnch set value []
data modify storage armored_elytra:storage elytraEnch set from entity @s Item.tag.Enchantments
execute store result score #elytraTotal armEly.dummy run data get storage armored_elytra:storage elytraEnch
execute as @e[type=minecraft:item,tag=armEly.chestplate] run function armored_elytra:store_chestplate_values
execute store result entity @s Item.tag.RepairCost int 1 run scoreboard players operation #elytraValue armEly.dummy += #chestplateValue armEly.dummy
execute if score #elytraTotal armEly.dummy matches 0 unless score #chestplateTotal armEly.dummy matches 0 run data modify entity @s Item.tag.Enchantments set from storage armored_elytra:storage chestplateEnch
execute unless score #elytraTotal armEly.dummy matches 0 unless score #chestplateTotal armEly.dummy matches 0 run function armored_elytra:merge_enchantments/start
kill @e[type=minecraft:item,tag=armEly.chestplate]
playsound minecraft:block.anvil.use block @a