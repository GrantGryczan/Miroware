execute as @e[type=minecraft:item,tag=craEncBoo.subtract1] store result score @s craEncBoo.count run data get entity @s Item.Count
tag @e[type=minecraft:item,tag=craEncBoo.book] add craEncBoo.subtract1
scoreboard players operation #sum craEncBoo.dummy -= #cost craEncBoo.dummy
execute as @e[type=minecraft:item,tag=craEncBoo.bottle] if score #cost craEncBoo.dummy matches 1.. run function craftable_enchanted_books:subtract
execute store result entity @s Item.Count byte 1 run scoreboard players operation @s craEncBoo.count -= #cost craEncBoo.dummy
execute as @e[type=minecraft:item,tag=craEncBoo.subtract1] store result entity @s Item.Count byte 1 run scoreboard players remove @s craEncBoo.count 1
playsound minecraft:block.enchantment_table.use block @a
tag @e[type=minecraft:item] remove craEncBoo.subtract1