function load {
	scoreboard objectives add armEly.dummy dummy
	execute unless entity 291dfbec-2b7b-4c2b-9899-f665ea53af5d positioned 22068880 1000 -4185488 run {
		name summon_marker
		forceload add ~ ~
		summon minecraft:armor_stand ~ ~ ~ {Marker:1b,NoGravity:1b,Invulnerable:1b,Invisible:1b,UUID:[I;689830892,729500715,-1734740379,-363614371]}
	}
}
function uninstall {
	kill 291dfbec-2b7b-4c2b-9899-f665ea53af5d
	forceload remove 22068880 -4185488
	scoreboard objectives remove armEly.dummy
	data remove storage armored_elytra:storage elytraEnch
	data remove storage armored_elytra:storage chestplateEnch
	data remove storage armored_elytra:storage elytraValue
	data remove storage armored_elytra:storage chestplateValue
	data remove storage armored_elytra:storage finalEnch
	data remove storage armored_elytra:storage item
	data remove storage armored_elytra:storage temp
	schedule clear armored_elytra:tick
}
clock 1t {
	name tick
	execute as @e[type=minecraft:item,tag=!armEly.checkedForElytraOnFire,predicate=armored_elytra:on_fire] run {
		name check_for_elytra_on_fire
		execute if entity @s[nbt={Item:{tag:{armElyData:{material:6}}}}] at @s run {
			name burn_elytra
			tag @s add armEly.subject
			data modify storage armored_elytra:storage item set from entity @s Item
			function armored_elytra:separate_enchantments/start
			execute as @e[type=minecraft:item,tag=armEly.separated] run {
				name copy_burning_elytra_tags
				data modify entity @s Motion set from entity @e[type=minecraft:item,tag=armEly.subject,limit=1] Motion
				data modify entity @s Fire set from entity @e[type=minecraft:item,tag=armEly.subject,limit=1] Fire
				data modify entity @s PickupDelay set from entity @e[type=minecraft:item,tag=armEly.subject,limit=1] PickupDelay
				data modify entity @s Owner set from entity @e[type=minecraft:item,tag=armEly.subject,limit=1] Owner
				tag @s remove armEly.separated
			}
			kill @s
		}
		tag @s add armEly.checkedForElytraOnFire
	}
}
clock 1s {
	name schedule
	execute as @e[type=minecraft:item,tag=!armEly.elytra] at @s if block ~ ~-0.01 ~ #minecraft:anvil if entity @s[nbt={Item:{id:"minecraft:elytra",Count:1b}}] run {
		name tag_elytra
		execute if entity @s[nbt={Item:{tag:{Damage:431}}}] run tag @s add armEly.done
		tag @s add armEly.elytra
	}
	execute as @e[type=minecraft:item,tag=armEly.elytra,tag=!armEly.done] at @s if block ~ ~-0.01 ~ #minecraft:anvil run {
		name tick_elytra_on_anvil
		tag @s add armEly.subject
		execute align xyz as @e[type=minecraft:item,tag=!armEly.elytra,dx=0,dy=0,dz=0] run {
			name check_for_chestplate
			tag @s add armEly.chestplate
			data modify entity 291dfbec-2b7b-4c2b-9899-f665ea53af5d HandItems[0] set from entity @s Item
			execute as 291dfbec-2b7b-4c2b-9899-f665ea53af5d if predicate armored_elytra:chestplate as @e[type=minecraft:item,tag=armEly.subject] run {
				name try_to_armor_elytra
				execute unless data entity @s Item.tag.armElyData.elytra run {
					name armor_elytra
					data modify entity @s Item.tag.armElyData.elytra set from entity @s Item
					scoreboard players set #found armEly.dummy 0
					execute if entity @e[type=minecraft:item,tag=armEly.chestplate,nbt={Item:{id:"minecraft:netherite_chestplate"}}] run {
						name armor/netherite
						data merge entity @s {PickupDelay:0s,Item:{tag:{armElyData:{armored:1b,material:6},AttributeModifiers:[{AttributeName:"minecraft:generic.armor",Name:"Armor",Slot:"chest",Operation:0,Amount:8.0d,UUID:[I;-1623373971,-1055374012,-2090507132,1761916046]},{AttributeName:"minecraft:generic.armor_toughness",Name:"Armor Toughness",Slot:"chest",Operation:0,Amount:3.0d,UUID:[I;-1623373971,-1055374012,-2090507132,1761916046]},{AttributeName:"minecraft:generic.knockback_resistance",Name:"Knockback Resistance",Slot:"chest",Operation:0,Amount:0.1d,UUID:[I;-1623373971,-1055374012,-2090507132,1761916046]}],CustomModelData:13522556}}}
						scoreboard players set #found armEly.dummy 1
					}
					execute if score #found armEly.dummy matches 0 if entity @e[type=minecraft:item,tag=armEly.chestplate,nbt={Item:{id:"minecraft:diamond_chestplate"}}] run {
						name armor/diamond
						data merge entity @s {PickupDelay:0s,Item:{tag:{armElyData:{armored:1b,material:5},AttributeModifiers:[{AttributeName:"minecraft:generic.armor",Name:"Armor",Slot:"chest",Operation:0,Amount:8.0d,UUID:[I;-1623373971,-1055374012,-2090507132,1761916046]},{AttributeName:"minecraft:generic.armor_toughness",Name:"Armor Toughness",Slot:"chest",Operation:0,Amount:2.0d,UUID:[I;-1623373971,-1055374012,-2090507132,1761916046]}],CustomModelData:13522555}}}
						scoreboard players set #found armEly.dummy 1
					}
					execute if score #found armEly.dummy matches 0 if entity @e[type=minecraft:item,tag=armEly.chestplate,nbt={Item:{id:"minecraft:iron_chestplate"}}] run {
						name armor/iron
						data merge entity @s {PickupDelay:0s,Item:{tag:{armElyData:{armored:1b,material:4},AttributeModifiers:[{AttributeName:"minecraft:generic.armor",Name:"Armor",Slot:"chest",Operation:0,Amount:6.0d,UUID:[I;-1623373971,-1055374012,-2090507132,1761916046]}],CustomModelData:13522554}}}
						scoreboard players set #found armEly.dummy 1
					}
					execute if score #found armEly.dummy matches 0 if entity @e[type=minecraft:item,tag=armEly.chestplate,nbt={Item:{id:"minecraft:golden_chestplate"}}] run {
						name armor/gold
						data merge entity @s {PickupDelay:0s,Item:{tag:{armElyData:{armored:1b,material:3},AttributeModifiers:[{AttributeName:"minecraft:generic.armor",Name:"Armor",Slot:"chest",Operation:0,Amount:5.0d,UUID:[I;-1623373971,-1055374012,-2090507132,1761916046]}],CustomModelData:13522553}}}
						scoreboard players set #found armEly.dummy 1
					}
					execute if score #found armEly.dummy matches 0 if entity @e[type=minecraft:item,tag=armEly.chestplate,nbt={Item:{id:"minecraft:chainmail_chestplate"}}] run {
						name armor/chain
						data merge entity @s {PickupDelay:0s,Item:{tag:{armElyData:{armored:1b,material:2},AttributeModifiers:[{AttributeName:"minecraft:generic.armor",Name:"Armor",Slot:"chest",Operation:0,Amount:5.0d,UUID:[I;-1623373971,-1055374012,-2090507132,1761916046]}],CustomModelData:13522552}}}
						scoreboard players set #found armEly.dummy 1
					}
					execute if score #found armEly.dummy matches 0 if entity @e[type=minecraft:item,tag=armEly.chestplate,nbt={Item:{id:"minecraft:leather_chestplate"}}] run {
						name armor/leather
						data merge entity @s {PickupDelay:0s,Item:{tag:{armElyData:{armored:1b,material:1},AttributeModifiers:[{AttributeName:"minecraft:generic.armor",Name:"Armor",Slot:"chest",Operation:0,Amount:3.0d,UUID:[I;-1623373971,-1055374012,-2090507132,1761916046]}],CustomModelData:13522551}}}
						scoreboard players set #found armEly.dummy 1
					}
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
					execute as @e[type=minecraft:item,tag=armEly.chestplate] run {
						name store_chestplate_values
						execute store result score #chestplateValue armEly.dummy run data get entity @s Item.tag.RepairCost
						data modify storage armored_elytra:storage chestplateEnch set value []
						data modify storage armored_elytra:storage chestplateEnch set from entity @s Item.tag.Enchantments
						execute store result score #chestplateTotal armEly.dummy run data get storage armored_elytra:storage chestplateEnch
					}
					execute store result entity @s Item.tag.RepairCost int 1 run scoreboard players operation #elytraValue armEly.dummy += #chestplateValue armEly.dummy
					execute if score #elytraTotal armEly.dummy matches 0 unless score #chestplateTotal armEly.dummy matches 0 run data modify entity @s Item.tag.Enchantments set from storage armored_elytra:storage chestplateEnch
					execute unless score #elytraTotal armEly.dummy matches 0 unless score #chestplateTotal armEly.dummy matches 0 run function armored_elytra:merge_enchantments/start
					kill @e[type=minecraft:item,tag=armEly.chestplate]
					playsound minecraft:block.anvil.use block @a
				}
				tag @s add armEly.done
			}
			tag @s remove armEly.chestplate
		}
		tag @s remove armEly.subject
	}
	execute as @e[type=minecraft:item,tag=!armEly.checkedForElytra] at @s if block ~ ~-0.01 ~ minecraft:grindstone run {
		name check_for_elytra_in_grindstone
		execute if data entity @s Item.tag.armElyData.armored positioned ~ ~-0.01 ~ align xyz positioned ~0.5 ~0.5 ~0.5 run {
			name grind_elytra
			playsound minecraft:block.grindstone.use block @a
			data modify storage armored_elytra:storage item set from entity @s Item
			function armored_elytra:separate_enchantments/start
			kill @s
		}
		tag @s add armEly.checkedForElytra
	}
}
dir merge_enchantments {
	function start {
		data modify storage armored_elytra:storage finalEnch set value []
		execute store result score #chestplateRemaining armEly.dummy run data get storage armored_elytra:storage chestplateEnch
		execute store result score #elytraTotal armEly.dummy run data get storage armored_elytra:storage elytraEnch
		execute unless score #chestplateRemaining armEly.dummy matches 0 run {
			name shift_chestplate_enchantment
			scoreboard players set #found armEly.dummy 0
			scoreboard players operation #elytraRemaining armEly.dummy = #elytraTotal armEly.dummy
			execute unless score #elytraTotal armEly.dummy matches 0 run {
				name check_elytra_enchantment
				data modify storage armored_elytra:storage temp set from storage armored_elytra:storage elytraEnch[0].id
				execute store success score #success armEly.dummy run data modify storage armored_elytra:storage temp set from storage armored_elytra:storage chestplateEnch[0].id
				execute if score #success armEly.dummy matches 0 run {
					name compare_levels
					execute store result score #elytraValue armEly.dummy run data get storage armored_elytra:storage elytraEnch[0].lvl
					execute store result score #chestplateValue armEly.dummy run data get storage armored_elytra:storage chestplateEnch[0].lvl
					execute if score #chestplateValue armEly.dummy > #elytraValue armEly.dummy run data modify storage armored_elytra:storage finalEnch append from storage armored_elytra:storage chestplateEnch[0]
					execute unless score #chestplateValue armEly.dummy > #elytraValue armEly.dummy run data modify storage armored_elytra:storage finalEnch append from storage armored_elytra:storage elytraEnch[0]
					data remove storage armored_elytra:storage elytraEnch[0]
					scoreboard players remove #elytraTotal armEly.dummy 1
					data remove storage armored_elytra:storage chestplateEnch[0]
					scoreboard players set #found armEly.dummy 1
				}
				execute if score #found armEly.dummy matches 0 run {
					name rotate_elytra_enchantment
					data modify storage armored_elytra:storage elytraEnch append from storage armored_elytra:storage elytraEnch[0]
					data remove storage armored_elytra:storage elytraEnch[0]
					scoreboard players remove #elytraRemaining armEly.dummy 1
					execute unless score #elytraRemaining armEly.dummy matches 0 run function armored_elytra:merge_enchantments/check_elytra_enchantment
				}
			}
			execute if score #found armEly.dummy matches 0 run {
				name add_enchantment_from_chestplate
				data modify storage armored_elytra:storage finalEnch append from storage armored_elytra:storage chestplateEnch[0]
				data remove storage armored_elytra:storage chestplateEnch[0]
			}
			scoreboard players remove #chestplateRemaining armEly.dummy 1
			execute unless score #chestplateRemaining armEly.dummy matches 0 run function $block
		}
		execute unless score #elytraTotal armEly.dummy matches 0 run {
			name add_enchantment_from_elytra
			data modify storage armored_elytra:storage finalEnch append from storage armored_elytra:storage elytraEnch[-1]
			data remove storage armored_elytra:storage elytraEnch[-1]
			scoreboard players remove #elytraTotal armEly.dummy 1
			execute unless score #elytraTotal armEly.dummy matches 0 run function $block
		}
		data modify entity @s Item.tag.Enchantments set from storage armored_elytra:storage finalEnch
	}
}
dir separate_enchantments {
	function start {
		summon minecraft:item ~ ~ ~ {Tags:["armEly.separated","armEly.elytra"],Item:{id:"minecraft:elytra",Count:1b}}
		summon minecraft:item ~ ~ ~ {Tags:["armEly.separated","armEly.chestplate"],Item:{id:"minecraft:chainmail_chestplate",Count:1b}}
		data modify storage armored_elytra:storage elytraEnch set from storage armored_elytra:storage item.tag.armElyData.elytra.tag.Enchantments
		data modify storage armored_elytra:storage chestplateEnch set from storage armored_elytra:storage item.tag.armElyData.chestplate.tag.Enchantments
		execute store result score #elytraTotal armEly.dummy run data get storage armored_elytra:storage elytraEnch
		execute store result score #chestplateTotal armEly.dummy run data get storage armored_elytra:storage chestplateEnch
		execute unless score #elytraTotal armEly.dummy matches 0 unless score #chestplateTotal armEly.dummy matches 0 run {
			name start_to_iterate
			scoreboard players operation #elytraRemaining armEly.dummy = #elytraTotal armEly.dummy
			block {
				name iterate_elytra_enchantments
				scoreboard players operation #chestplateRemaining armEly.dummy = #chestplateTotal armEly.dummy
				block {
					name iterate_chestplate_enchantments
					data modify storage armored_elytra:storage temp set from storage armored_elytra:storage elytraEnch[0].id
					execute store success score #success armEly.dummy run data modify storage armored_elytra:storage temp set from storage armored_elytra:storage chestplateEnch[0].id
					execute if score #success armEly.dummy matches 0 run {
						name compare_levels
						execute store result score #elytraValue armEly.dummy run data get storage armored_elytra:storage elytraEnch[0].lvl
						execute store result score #chestplateValue armEly.dummy run data get storage armored_elytra:storage chestplateEnch[0].lvl
						execute if score #chestplateValue armEly.dummy > #elytraValue armEly.dummy run {
							name add_elytra_enchantment
							data modify storage armored_elytra:storage elytraFinalEnch append from storage armored_elytra:storage elytraEnch[0]
							data remove storage armored_elytra:storage elytraEnch[0]
							scoreboard players remove #elytraTotal armEly.dummy 1
						}
						execute unless score #chestplateValue armEly.dummy > #elytraValue armEly.dummy run {
							name add_chestplate_enchantment
							data modify storage armored_elytra:storage chestplateFinalEnch append from storage armored_elytra:storage chestplateEnch[0]
							data remove storage armored_elytra:storage chestplateEnch[0]
							scoreboard players remove #chestplateTotal armEly.dummy 1
						}
					}
					execute unless score #success armEly.dummy matches 0 run {
						name rotate_chestplate_enchantment
						data modify storage armored_elytra:storage chestplateEnch append from storage armored_elytra:storage chestplateEnch[0]
						data remove storage armored_elytra:storage chestplateEnch[0]
						scoreboard players remove #chestplateRemaining armEly.dummy 1
						execute unless score #chestplateRemaining armEly.dummy matches 0 run function armored_elytra:separate_enchantments/iterate_chestplate_enchantments
					}
				}
				execute unless score #elytraTotal armEly.dummy matches 0 unless score #chestplateTotal armEly.dummy matches 0 run {
					name rotate_elytra_enchantment
					data modify storage armored_elytra:storage elytraEnch append from storage armored_elytra:storage elytraEnch[0]
					data remove storage armored_elytra:storage elytraEnch[0]
					scoreboard players remove #elytraRemaining armEly.dummy 1
					execute unless score #elytraRemaining armEly.dummy matches 0 run function armored_elytra:separate_enchantments/iterate_elytra_enchantments
				}
			}
		}
		data modify storage armored_elytra:storage ench set from storage armored_elytra:storage item.tag.Enchantments
		execute store result score #remaining armEly.dummy run data get storage armored_elytra:storage ench
		execute unless score #remaining armEly.dummy matches 0 run {
			name shift_enchantment
			scoreboard players set #found armEly.dummy 0
			execute unless score #chestplateTotal armEly.dummy matches 0 run {
				name check_chestplate_enchantments
				scoreboard players operation #chestplateRemaining armEly.dummy = #chestplateTotal armEly.dummy
				block {
					name check_chestplate_enchantment
					data modify storage armored_elytra:storage temp set from storage armored_elytra:storage ench[0].id
					execute store success score #success armEly.dummy run data modify storage armored_elytra:storage temp set from storage armored_elytra:storage chestplateEnch[0].id
					execute if score #success armEly.dummy matches 0 run {
						name add_enchantment_to_chestplate
						scoreboard players set #found armEly.dummy 1
						data modify storage armored_elytra:storage chestplateFinalEnch append from storage armored_elytra:storage ench[0]
						data remove storage armored_elytra:storage chestplateEnch[0]
						scoreboard players remove #chestplateTotal armEly.dummy 1
					}
					execute if score #found armEly.dummy matches 0 run {
						name rotate_chestplate_enchantment_2
						data modify storage armored_elytra:storage chestplateEnch append from storage armored_elytra:storage chestplateEnch[0]
						data remove storage armored_elytra:storage chestplateEnch[0]
						scoreboard players remove #chestplateRemaining armEly.dummy 1
						execute unless score #chestplateRemaining armEly.dummy matches 0 run function armored_elytra:separate_enchantments/check_chestplate_enchantment
					}
				}
			}
			execute if score #found armEly.dummy matches 0 run data modify storage armored_elytra:storage elytraFinalEnch append from storage armored_elytra:storage ench[0]
			data remove storage armored_elytra:storage ench[0]
			scoreboard players remove #remaining armEly.dummy 1
			execute unless score #remaining armEly.dummy matches 0 run function $block
		}
		data modify storage armored_elytra:storage item.tag.armElyData.elytra.tag.Enchantments set from storage armored_elytra:storage elytraFinalEnch
		execute unless data storage armored_elytra:storage elytraFinalEnch run data remove storage armored_elytra:storage item.tag.armElyData.elytra.tag.Enchantments
		data modify storage armored_elytra:storage item.tag.armElyData.chestplate.tag.Enchantments set from storage armored_elytra:storage chestplateFinalEnch
		execute unless data storage armored_elytra:storage chestplateFinalEnch run data remove storage armored_elytra:storage item.tag.armElyData.chestplate.tag.Enchantments
		data modify storage armored_elytra:storage item.tag.armElyData.elytra.tag.Damage set from storage armored_elytra:storage item.tag.Damage
		data modify storage armored_elytra:storage item.tag.armElyData.elytra.tag.display.Name set from storage armored_elytra:storage item.tag.display.Name
		data modify entity @e[type=minecraft:item,tag=armEly.elytra,limit=1] Item set from storage armored_elytra:storage item.tag.armElyData.elytra
		data modify entity @e[type=minecraft:item,tag=armEly.chestplate,limit=1] Item set from storage armored_elytra:storage item.tag.armElyData.chestplate
		data remove storage armored_elytra:storage elytraFinalEnch
		data remove storage armored_elytra:storage chestplateFinalEnch
		tag @e[type=minecraft:item] remove armEly.elytra
		tag @e[type=minecraft:item] remove armEly.chestplate
	}
}
function break_armored_elytra {
	advancement revoke @s only armored_elytra:break_armored_elytra
	tag @s add armEly.subject
	data modify storage armored_elytra:storage item set from entity @s Inventory[{Slot:102b}]
	data modify storage armored_elytra:storage item.tag.Damage set value 431
	function armored_elytra:separate_enchantments/start
	execute as @e[type=minecraft:item,tag=armEly.separated] run {
		name set_owner
		data modify entity @s Owner set from entity @a[tag=armEly.subject,limit=1] UUID
		tag @s remove armEly.separated
	}
	replaceitem entity @s armor.chest minecraft:air
	tag @s remove armEly.subject
}
