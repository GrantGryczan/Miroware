function load {
	scoreboard objectives add craEncBoo.count dummy
	scoreboard objectives add craEncBoo.dummy dummy
	scoreboard objectives add craEncBoo trigger
}
function uninstall {
	scoreboard objectives remove craEncBoo.count
	scoreboard objectives remove craEncBoo.dummy
	scoreboard objectives remove craEncBoo
	schedule clear craftable_enchanted_books:tick
}
clock 1t {
	name tick
	scoreboard players enable @a craEncBoo
	give @a[scores={craEncBoo=1}] minecraft:written_book{author:"GrantGryczan",title:"Craftable Enchanted Books",pages:['{"text":"To craft an enchanted book, drop one book, one ingredient, and a certain number of bottles o\' enchanting into a cauldron.\\nRecipes are listed alphabetically in the following format.\\n\\nEnchantment\\n- Ingredient\\n- # XP Bottles"}','[{"translate":"enchantment.minecraft.aqua_affinity"},{"text":"\\n- "},{"translate":"item.minecraft.prismarine_crystals"},{"text":"\\n- 12 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.bane_of_arthropods"},{"text":"\\n- "},{"translate":"item.minecraft.spider_eye"},{"text":"\\n- 6 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.binding_curse"},{"text":"\\n- "},{"translate":"item.minecraft.popped_chorus_fruit"},{"text":"\\n- 20 XP Bottles"}]','[{"translate":"enchantment.minecraft.blast_protection"},{"text":"\\n- "},{"translate":"item.minecraft.gunpowder"},{"text":"\\n- 6 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.channeling"},{"text":"\\n- "},{"translate":"block.minecraft.wither_skeleton_skull"},{"text":"\\n- 20 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.depth_strider"},{"text":"\\n- "},{"translate":"item.minecraft.prismarine_shard"},{"text":"\\n- 12 XP Bottles"}]','[{"translate":"enchantment.minecraft.efficiency"},{"text":"\\n- "},{"translate":"item.minecraft.redstone"},{"text":"\\n- 2 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.feather_falling"},{"text":"\\n- "},{"translate":"item.minecraft.feather"},{"text":"\\n- 6 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.fire_aspect"},{"text":"\\n- "},{"translate":"item.minecraft.blaze_rod"},{"text":"\\n- 12 XP Bottles"}]','[{"translate":"enchantment.minecraft.fire_protection"},{"text":"\\n- "},{"translate":"item.minecraft.magma_cream"},{"text":"\\n- 6 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.flame"},{"text":"\\n- "},{"translate":"item.minecraft.blaze_powder"},{"text":"\\n- 12 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.fortune"},{"text":"\\n- "},{"translate":"item.minecraft.emerald"},{"text":"\\n- 12 XP Bottles"}]','[{"translate":"enchantment.minecraft.frost_walker"},{"text":"\\n- "},{"translate":"block.minecraft.ice"},{"text":"\\n- 20 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.impaling"},{"text":"\\n- "},{"translate":"item.minecraft.scute"},{"text":"\\n- 6 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.infinity"},{"text":"\\n- "},{"translate":"item.minecraft.ender_eye"},{"text":"\\n- 20 XP Bottles"}]','[{"translate":"enchantment.minecraft.knockback"},{"text":"\\n- "},{"translate":"block.minecraft.piston"},{"text":"\\n- 6 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.looting"},{"text":"\\n- "},{"translate":"item.minecraft.gold_ingot"},{"text":"\\n- 12 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.loyalty"},{"text":"\\n- "},{"translate":"item.minecraft.lead"},{"text":"\\n- 12 XP Bottles"}]','[{"translate":"enchantment.minecraft.luck_of_the_sea"},{"text":"\\n- "},{"translate":"item.minecraft.tropical_fish"},{"text":"\\n- 12 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.lure"},{"text":"\\n- "},{"translate":"item.minecraft.carrot_on_a_stick"},{"text":"\\n- 12 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.mending"},{"text":"\\n- "},{"translate":"item.minecraft.nether_star"},{"text":"\\n- 20 XP Bottles"}]','[{"translate":"enchantment.minecraft.multishot"},{"text":"\\n- "},{"translate":"item.minecraft.arrow"},{"text":"\\n- 12 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.piercing"},{"text":"\\n- "},{"translate":"item.minecraft.ender_pearl"},{"text":"\\n- 6 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.power"},{"text":"\\n- "},{"translate":"item.minecraft.flint"},{"text":"\\n- 2 XP Bottles"}]','[{"translate":"enchantment.minecraft.projectile_protection"},{"text":"\\n- "},{"translate":"item.minecraft.shield"},{"text":"\\n- 6 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.protection"},{"text":"\\n- "},{"translate":"item.minecraft.iron_ingot"},{"text":"\\n- 2 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.punch"},{"text":"\\n- "},{"translate":"item.minecraft.string"},{"text":"\\n- 12 XP Bottles"}]','[{"translate":"enchantment.minecraft.quick_charge"},{"text":"\\n- "},{"translate":"item.minecraft.fire_charge"},{"text":"\\n- 6 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.respiration"},{"text":"\\n- "},{"translate":"item.minecraft.pufferfish"},{"text":"\\n- 12 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.riptide"},{"text":"\\n- "},{"translate":"block.minecraft.sponge"},{"text":"\\n- 20 XP Bottles"}]','[{"translate":"enchantment.minecraft.sharpness"},{"text":"\\n- "},{"translate":"item.minecraft.quartz"},{"text":"\\n- 2 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.silk_touch"},{"text":"\\n- "},{"translate":"item.minecraft.glowstone_dust"},{"text":"\\n- 20 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.smite"},{"text":"\\n- "},{"translate":"item.minecraft.rotten_flesh"},{"text":"\\n- 6 XP Bottles"}]','[{"translate":"enchantment.minecraft.sweeping"},{"text":"\\n- "},{"translate":"block.minecraft.sugar_cane"},{"text":"\\n- 12 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.thorns"},{"text":"\\n- "},{"translate":"block.minecraft.rose_bush"},{"text":"\\n- 20 XP Bottles\\n\\n"},{"translate":"enchantment.minecraft.unbreaking"},{"text":"\\n- "},{"translate":"block.minecraft.obsidian"},{"text":"\\n- 6 XP Bottles"}]','[{"translate":"enchantment.minecraft.vanishing_curse"},{"text":"\\n- "},{"translate":"item.minecraft.ghast_tear"},{"text":"\\n- 20 XP Bottles"}]'],resolved:1b}
	scoreboard players set @a craEncBoo 0
	execute as @e[type=minecraft:item] at @s if block ~ ~ ~ minecraft:cauldron if entity @s[nbt={Item:{id:"minecraft:book"}}] align xyz run {
		name tick_book
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
	}
}
function craft_enchanted_book {
	execute as @e[type=minecraft:item,tag=craEncBoo.subtract1] store result score @s craEncBoo.count run data get entity @s Item.Count
	tag @e[type=minecraft:item,tag=craEncBoo.book] add craEncBoo.subtract1
	scoreboard players operation #sum craEncBoo.dummy -= #cost craEncBoo.dummy
	execute as @e[type=minecraft:item,tag=craEncBoo.bottle] if score #cost craEncBoo.dummy matches 1.. run {
		name subtract
		execute if score @s craEncBoo.count > #cost craEncBoo.dummy run {
			name subtract_portion
			summon minecraft:item ~ ~ ~ {Tags:["craEncBoo.newBottle"],Item:{id:"minecraft:glass_bottle",Count:1b}}
			execute store result entity @e[type=minecraft:item,tag=craEncBoo.newBottle,limit=1] Item.Count byte 1 run scoreboard players get #cost craEncBoo.dummy
			execute store result entity @s Item.Count byte 1 run scoreboard players operation @s craEncBoo.count -= #cost craEncBoo.dummy
			scoreboard players set #cost craEncBoo.dummy 0
			tag @e[type=minecraft:item] remove craEncBoo.newBottle
		}
		execute unless score @s craEncBoo.count > #cost craEncBoo.dummy run {
			name subtract_whole
			data modify entity @s Item.id set value "minecraft:glass_bottle"
			scoreboard players operation #cost craEncBoo.dummy -= @s craEncBoo.count
			tag @s remove craEncBoo.bottle
		}
	}
	execute store result entity @s Item.Count byte 1 run scoreboard players operation @s craEncBoo.count -= #cost craEncBoo.dummy
	execute as @e[type=minecraft:item,tag=craEncBoo.subtract1] store result entity @s Item.Count byte 1 run scoreboard players remove @s craEncBoo.count 1
	playsound minecraft:block.enchantment_table.use block @a
	tag @e[type=minecraft:item] remove craEncBoo.subtract1
}
