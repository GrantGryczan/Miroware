tag @s add craEncBoo.book
execute store result score @s craEncBoo.count run data get entity @s Item.Count
tag @e[dx=0,dy=0,dz=0,type=minecraft:item,nbt={Item:{id:"minecraft:experience_bottle"}}] add craEncBoo.bottle
execute as @e[type=minecraft:item,tag=craEncBoo.bottle] store result score @s craEncBoo.count run data get entity @s Item.Count
execute as @e[type=minecraft:item,tag=craEncBoo.bottle] run scoreboard players operation #sum craEncBoo.dummy += @s craEncBoo.count
execute if score #sum craEncBoo.dummy matches 12.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:prismarine_crystals"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:aqua_affinity",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 12
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 6.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:spider_eye"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:bane_of_arthropods",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 6
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 20.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:popped_chorus_fruit"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:binding_curse",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 20
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 6.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:gunpowder"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:blast_protection",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 6
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 20.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:wither_skeleton_skull"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:channeling",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 20
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 12.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:prismarine_shard"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:depth_strider",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 12
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 2.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:redstone"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:efficiency",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 2
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 6.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:feather"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:feather_falling",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 6
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 12.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:blaze_rod"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:fire_aspect",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 12
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 6.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:magma_cream"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:fire_protection",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 6
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 12.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:blaze_powder"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:flame",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 12
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 12.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:emerald"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:fortune",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 12
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 20.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:ice"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:frost_walker",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 20
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 6.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:scute"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:impaling",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 6
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 20.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:ender_eye"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:infinity",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 20
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 6.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:piston"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:knockback",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 6
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 12.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:gold_ingot"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:looting",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 12
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 12.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:lead"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:loyalty",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 12
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 12.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:tropical_fish"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:luck_of_the_sea",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 12
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 12.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:carrot_on_a_stick"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:lure",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 12
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 20.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:nether_star"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:mending",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 20
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 12.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:arrow"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:multishot",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 12
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 6.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:ender_pearl"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:piercing",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 6
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 2.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:flint"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:power",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 2
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 6.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:shield"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:projectile_protection",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 6
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 2.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:iron_ingot"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:protection",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 2
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 12.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:string"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:punch",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 12
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 6.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:fire_charge"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:quick_charge",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 6
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 12.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:pufferfish"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:respiration",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 12
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 20.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:sponge"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:riptide",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 20
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 2.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:quartz"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:sharpness",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 2
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 20.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:glowstone_dust"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:silk_touch",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 20
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 6.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:rotten_flesh"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:smite",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 6
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 12.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:soul_soil"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:soul_speed",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 12
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 12.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:sugar_cane"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:sweeping",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 12
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 20.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:rose_bush"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:thorns",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 20
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 6.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:obsidian"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:unbreaking",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 6
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
execute if score #sum craEncBoo.dummy matches 20.. run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,limit=1,nbt={Item:{id:"minecraft:ghast_tear"}}] add craEncBoo.subtract1
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run summon minecraft:item ~ ~ ~ {PickupDelay:10s,Item:{id:"minecraft:enchanted_book",Count:1b,tag:{StoredEnchantments:[{id:"minecraft:vanishing_curse",lvl:1s}]}}}
execute if entity @e[type=minecraft:item,tag=craEncBoo.subtract1] run scoreboard players set #cost craEncBoo.dummy 20
execute at @e[type=minecraft:item,tag=craEncBoo.subtract1] run function craftable_enchanted_books:craft_enchanted_book
tag @e[type=minecraft:item] remove craEncBoo.bottle
scoreboard players set #sum craEncBoo.dummy 0
tag @s remove craEncBoo.book