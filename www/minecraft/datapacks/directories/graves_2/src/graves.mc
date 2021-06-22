function load {
	scoreboard objectives add graves.config dummy "Graves Config"
	scoreboard objectives add graves.deaths deathCount
	scoreboard objectives add graves.id dummy
	scoreboard objectives add graves.dummy dummy
	scoreboard objectives add graves.age dummy
	scoreboard objectives add graves.api dummy
	scoreboard objectives add grave trigger "Locate Last Grave"
	execute unless score #robbing graves.config matches 0..1 run scoreboard players set #robbing graves.config 0
	execute unless score #xp graves.config matches 0..1 run scoreboard players set #xp graves.config 1
	execute unless score #locating graves.config matches 0..1 run scoreboard players set #locating graves.config 1
	execute unless score #despawn graves.config matches 0.. run scoreboard players set #despawn graves.config 0
	scoreboard players set #pointsPerLevel graves.dummy 7
	scoreboard players set #prevOverworldDoImmediateRespawn graves.dummy 0
	scoreboard players set #prevNetherDoImmediateRespawn graves.dummy 0
	scoreboard players set #prevEndDoImmediateRespawn graves.dummy 0
	execute in minecraft:overworld run gamerule keepInventory true
	execute in minecraft:the_nether run gamerule keepInventory false
	execute in minecraft:overworld store result score #dimGameRules graves.dummy run gamerule keepInventory
	execute in minecraft:the_nether run gamerule keepInventory true
	execute in minecraft:the_end run gamerule keepInventory true
	scoreboard players reset * graves.deaths
	execute as @e[type=minecraft:armor_stand,tag=graves.hitbox] run {
		name load_hitbox
		execute store result score @s graves.id run data get entity @s HandItems[1].tag.gravesData.id
		data modify entity @s ArmorItems[0] set from entity @s HandItems[1]
		data modify entity @s ArmorItems[1] set from entity @s HandItems[1]
		data modify entity @s ArmorItems[2] set from entity @s HandItems[1]
		data modify entity @s ArmorItems[3] set from entity @s HandItems[1]
	}
	execute as @e[type=minecraft:armor_stand,tag=graves.model] store result score @s graves.id run data get entity @s ArmorItems[3].tag.gravesData.id
	advancement revoke @a only graves:interact_with_grave
}
function uninstall {
	schedule clear graves:tick
	schedule clear graves:schedule
	schedule clear graves:update_model
	scoreboard objectives remove graves.config
	scoreboard objectives remove graves.deaths
	scoreboard objectives remove graves.id
	scoreboard objectives remove graves.dummy
	scoreboard objectives remove graves.api
	scoreboard objectives remove grave
	data remove storage graves:storage players
	data remove storage graves:storage lastGrave
	data remove storage graves:storage temp
}
clock 1t {
	name tick
	execute as @a[scores={graves.deaths=1..}] run {
		name die
		execute at @s[gamemode=!spectator] run {
			name handle_death
			execute store result score #xp graves.dummy run data get entity @s XpLevel
			scoreboard players operation #xp graves.dummy *= #pointsPerLevel graves.dummy
			execute if score #xp graves.dummy matches 101.. run scoreboard players set #xp graves.dummy 100
			scoreboard players set #deathMode graves.api -1
			function #graves:handle_death
			execute if score #deathMode graves.api matches -1 run {
				name try_to_create_grave
				execute unless score #xp graves.config matches 1 if score #xp graves.dummy matches 1.. run function graves:drop_xp
				execute if data entity @s Inventory[0] align xyz run function graves:create_grave
				execute if score #xp graves.config matches 1 if score #xp graves.dummy matches 1.. align xyz run function graves:create_grave
				xp set @s 0 levels
				xp set @s 0 points
			}
		}
		scoreboard players reset @s graves.deaths
	}
	execute as @e[type=minecraft:armor_stand,tag=graves.hitbox] at @s if entity @a[gamemode=!spectator,distance=..2] align xz run {
		name show_name
		execute unless entity @e[dx=0,dy=0,dz=0,type=minecraft:area_effect_cloud,tag=graves.name,limit=1] run {
			name create_name
			summon minecraft:area_effect_cloud ~0.5 ~ ~0.5 {Tags:["graves.name"],CustomNameVisible:1b,Duration:2}
			data modify entity @e[dx=0,dy=0,dz=0,type=minecraft:area_effect_cloud,tag=graves.name,limit=1] CustomName set from entity @s CustomName
		}
		data modify entity @e[dx=0,dy=0,dz=0,type=minecraft:area_effect_cloud,tag=graves.name,limit=1] Age set value 0
	}
	scoreboard players enable @a grave
	execute as @a[scores={grave=1}] run {
		name trigger_grave
		execute if score #locating graves.config matches 0 run tellraw @s {"text":"Grave locating is disabled.","color":"red"}
		execute if score #locating graves.config matches 1 run {
			name locate_grave
			function graves:rotate/players
			execute store success score #success graves.dummy if data storage graves:storage players[-1].graves[-1]
			execute if score #success graves.dummy matches 1 run tellraw @s [{"text":"Your last grave is at ","color":"COLOR_1"},{"text":"(","color":"COLOR_2"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].x","color":"COLOR_2"},{"text":", ","color":"COLOR_2"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].y","color":"COLOR_2"},{"text":", ","color":"COLOR_2"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].z","color":"COLOR_2"},{"text":")","color":"COLOR_2"},{"text":" in ","color":"COLOR_1"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].dim"},{"text":".","color":"COLOR_1"}]
			execute unless score #success graves.dummy matches 1 run tellraw @s {"text":"You do not have a last grave.","color":"red"}
		}
		scoreboard players set @a grave 0
	}
}
clock 1s {
	name age_graves
	execute unless score #despawn graves.config matches 0 as @e[type=minecraft:armor_stand,tag=graves.hitbox] run {
		name age_grave
		scoreboard players add @s graves.age 1
		execute if score @s graves.age > #despawn graves.config at @s run {
			name despawn_grave
			execute store result score #remaining graves.dummy run data get storage graves:storage players
			data modify storage graves:storage temp set from entity @s HandItems[1].tag.gravesData.uuid
			execute store success score #success graves.dummy run data modify storage graves:storage temp set from storage graves:storage players[-1].uuid
			execute if score #success graves.dummy matches 1 run function graves:rotate/player_as_grave
			scoreboard players set #rotated graves.dummy 0
			function graves:rotate/graves
			data remove storage graves:storage players[-1].graves[-1]
			scoreboard players remove #remaining graves.dummy 1
			execute unless score #rotated graves.dummy matches 0 unless score #remaining graves.dummy matches 0 run function graves:rotate/back_grave
			execute store result score #activated graves.dummy run data get entity @s HandItems[1].tag.gravesData.id
			execute as @e[type=minecraft:armor_stand,tag=graves.model] run function graves:kill_model
			playsound minecraft:block.stone.break block @a
			particle minecraft:poof ~ ~0.7 ~ 0 0 0 0.05 10
			kill @s
		}
	}
}
clock 2s {
	name schedule
	execute as @e[type=minecraft:armor_stand,tag=graves.model] at @s positioned ~ ~1.375 ~ run {
		name fix_hitbox_position
		scoreboard players operation #id graves.dummy = @s graves.id
		execute as @e[type=minecraft:armor_stand,tag=graves.hitbox,distance=..0.01] unless score @s graves.id = #id graves.dummy as @e[type=minecraft:armor_stand,tag=graves.hitbox,distance=0.01..] if score @s graves.id = #id graves.dummy run tp @s ~ ~ ~
		execute unless entity @e[type=minecraft:armor_stand,tag=graves.hitbox,distance=..0.01] as @e[type=minecraft:armor_stand,tag=graves.hitbox,distance=0.01..] if score @s graves.id = #id graves.dummy run tp @s ~ ~ ~
	}
	execute in minecraft:overworld store result score #keepInventory graves.dummy run gamerule keepInventory
	execute if score #keepInventory graves.dummy matches 0 if score #prevOverworldKeepInventory graves.dummy matches 1 run tellraw @a {"text":"The Graves data pack cannot read player inventories correctly unless gamerule keepInventory is true.","color":"red"}
	scoreboard players operation #prevOverworldKeepInventory graves.dummy = #keepInventory graves.dummy
	execute in minecraft:overworld store result score #doImmediateRespawn graves.dummy run gamerule doImmediateRespawn
	execute if score #doImmediateRespawn graves.dummy matches 1 if score #prevOverworldDoImmediateRespawn graves.dummy matches 0 run tellraw @a {"text":"The Graves data pack cannot position graves correctly unless gamerule doImmediateRespawn is false.","color":"red"}
	scoreboard players operation #prevOverworldDoImmediateRespawn graves.dummy = #doImmediateRespawn graves.dummy
	execute if score #dimGameRules graves.dummy matches 1 run {
		name check_dimensional_game_rules
		execute in minecraft:the_nether store result score #keepInventory graves.dummy run gamerule keepInventory
		execute if score #keepInventory graves.dummy matches 0 if score #prevNetherKeepInventory graves.dummy matches 1 run tellraw @a {"text":"The Graves data pack cannot read player inventories correctly unless gamerule keepInventory is true.","color":"red"}
		scoreboard players operation #prevNetherKeepInventory graves.dummy = #keepInventory graves.dummy
		execute in minecraft:the_end store result score #keepInventory graves.dummy run gamerule keepInventory
		execute if score #keepInventory graves.dummy matches 0 if score #prevEndKeepInventory graves.dummy matches 1 run tellraw @a {"text":"The Graves data pack cannot read player inventories correctly unless gamerule keepInventory is true.","color":"red"}
		scoreboard players operation #prevEndKeepInventory graves.dummy = #keepInventory graves.dummy
		execute in minecraft:the_nether store result score #doImmediateRespawn graves.dummy run gamerule doImmediateRespawn
		execute if score #doImmediateRespawn graves.dummy matches 1 if score #prevNetherDoImmediateRespawn graves.dummy matches 0 run tellraw @a {"text":"The Graves data pack cannot position graves correctly unless gamerule doImmediateRespawn is false.","color":"red"}
		scoreboard players operation #prevNetherDoImmediateRespawn graves.dummy = #doImmediateRespawn graves.dummy
		execute in minecraft:the_end store result score #doImmediateRespawn graves.dummy run gamerule doImmediateRespawn
		execute if score #doImmediateRespawn graves.dummy matches 1 if score #prevEndDoImmediateRespawn graves.dummy matches 0 run tellraw @a {"text":"The Graves data pack cannot position graves correctly unless gamerule doImmediateRespawn is false.","color":"red"}
		scoreboard players operation #prevEndDoImmediateRespawn graves.dummy = #doImmediateRespawn graves.dummy
	}
}
clock 20s {
	name update_model
	execute as @e[type=minecraft:armor_stand,tag=graves.model] run data merge entity @s {Air:32767s}
}
function interact_with_grave {
	function graves:activate_graves
	schedule 1t replace {
		name activate_graves
		execute as @a[advancements={graves:interact_with_grave=true}] at @s run {
			name activate_grave
			tag @s add graves.subject
			advancement revoke @s only graves:interact_with_grave
			execute store result score #activated graves.dummy run data get entity @s Inventory[{tag:{gravesData:{}}}].tag.gravesData.id
			execute as @e[type=minecraft:armor_stand,tag=graves.hitbox] run {
				name check_hitbox
				execute store result score @s graves.id run data get entity @s HandItems[1].tag.gravesData.id
				execute if score @s graves.id = #activated graves.dummy run tag @s add graves.activated
			}
			execute if score #robbing graves.config matches 0 unless data entity @e[type=minecraft:armor_stand,tag=graves.activated,limit=1] ArmorItems[{tag:{gravesKey:1b}}] run {
				name check_owner
				data modify storage graves:storage temp set from entity @s UUID
				execute store success score #success graves.dummy run data modify storage graves:storage temp set from entity @e[type=minecraft:armor_stand,tag=graves.activated,limit=1] HandItems[1].tag.gravesData.uuid
				execute if score #success graves.dummy matches 1 run {
					name fail_robbing
					tellraw @s {"text":"Grave robbing is disabled.","color":"red"}
					scoreboard players set #failed graves.dummy 1
				}
			}
			execute as @e[type=minecraft:armor_stand,tag=graves.activated] run {
				name fix_equipment/all
				LOOP (4, i) {
					execute store result score #count graves.dummy run data get entity @s ArmorItems[<% i %>].Count
					execute if score #count graves.dummy matches 1 run {
						name fix_equipment/check_<% i %>
						execute if entity @a[tag=graves.subject,gamemode=creative] run {
							name fix_equipment/drop_<% i %>
							summon minecraft:item ~ ~ ~ {Tags:["graves.item"],Item:{id:"minecraft:stone_button",Count:1b}}
							data modify entity @e[type=minecraft:item,tag=graves.item,limit=1] Item set from entity @s ArmorItems[<% i %>]
							data modify entity @e[type=minecraft:item,tag=graves.item,limit=1] Owner set from entity @a[tag=graves.subject,limit=1] UUID
							tag @e[type=minecraft:item] remove graves.item
						}
						execute unless entity @a[tag=graves.subject,gamemode=creative] unless data entity @s ArmorItems[<% i %>].tag.gravesKey run function graves:fix_equipment/drop_<% i %>
					}
					execute unless score #count graves.dummy matches 2 run data modify entity @s ArmorItems[<% i %>] set from entity @s HandItems[1]
				}
				execute if score #failed graves.dummy matches 1 run tag @s remove graves.activated
				scoreboard players set #failed graves.dummy 0
			}
			execute as @e[type=minecraft:armor_stand,tag=graves.activated] at @s run {
				name open_grave
				execute store result score #remaining graves.dummy run data get storage graves:storage players
				data modify storage graves:storage temp set from entity @s HandItems[1].tag.gravesData.uuid
				execute store success score #success graves.dummy run data modify storage graves:storage temp set from storage graves:storage players[-1].uuid
				execute if score #success graves.dummy matches 1 run function graves:rotate/player_as_grave
				scoreboard players set #rotated graves.dummy 0
				function graves:rotate/graves
				data remove storage graves:storage players[-1].graves[-1]
				scoreboard players remove #remaining graves.dummy 1
				execute unless score #rotated graves.dummy matches 0 unless score #remaining graves.dummy matches 0 run function graves:rotate/back_grave
				execute as @e[type=minecraft:armor_stand,tag=graves.model] run {
					name kill_model
					execute store result score @s graves.id run data get entity @s ArmorItems[3].tag.gravesData.id
					execute if score @s graves.id = #activated graves.dummy run kill @s
				}
				execute store result score #remaining graves.dummy run data get entity @s HandItems[0].tag.gravesData.items
				execute if score #remaining graves.dummy matches 1.. run {
					name drop_item
					summon minecraft:item ~ ~0.2 ~ {Tags:["graves.item"],Item:{id:"minecraft:bone",Count:1b}}
					data modify entity @e[type=minecraft:item,tag=graves.item,limit=1] Item set from entity @s HandItems[0].tag.gravesData.items[0]
					execute as @a[tag=graves.subject,predicate=graves:sneaking,limit=1] run data modify entity @e[type=minecraft:item,tag=graves.item,limit=1] Owner set from entity @s UUID
					tag @e[type=minecraft:item,tag=graves.item] remove graves.item
					data remove entity @s HandItems[0].tag.gravesData.items[0]
					scoreboard players remove #remaining graves.dummy 1
					execute if score #remaining graves.dummy matches 1.. run function $block
				}
				execute if entity @s[tag=graves.hasXP] run {
					name read_xp
					execute store result score #xp graves.dummy run data get entity @s HandItems[0].tag.gravesData.xp
					function graves:drop_xp
				}
				playsound minecraft:block.stone.break block @a
				particle minecraft:poof ~ ~0.7 ~ 0 0 0 0.05 10
				kill @s
			}
			clear @s minecraft:stone_button{gravesData:{}}
			tag @s remove graves.subject
		}
	}
}
function create_grave {
	tag @s add graves.player
	function graves:rotate/players
	execute store result score #id graves.dummy run data get storage graves:storage lastGrave
	data modify storage graves:storage players[-1].graves append value {}
	execute store result storage graves:storage players[-1].graves[-1].id int 1 run scoreboard players add #id graves.dummy 1
	data modify storage graves:storage players[-1].graves[-1].dim set from entity @s Dimension
	execute store result storage graves:storage lastGrave int 1 run scoreboard players get #id graves.dummy
	summon minecraft:armor_stand ~ ~ ~ {Tags:["graves.marker","graves.hitbox","graves.new"],Invisible:1b,NoGravity:1b,Invulnerable:1b,Small:1b,DisabledSlots:256,HandItems:[{id:"minecraft:stone_button",Count:1b,tag:{gravesData:{items:[]}}},{id:"minecraft:stone_button",Count:2b,tag:{gravesData:{}}}],Pose:{RightArm:[0.0f,-90.0f,0.0f],LeftArm:[0.0f,90.0f,0.0f],Head:[180.0f,0.0f,0.0f]},Silent:1b}
	# data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items set from entity @s Inventory
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:0b}]
	item replace entity @s hotbar.0 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:1b}]
	item replace entity @s hotbar.1 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:2b}]
	item replace entity @s hotbar.2 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:3b}]
	item replace entity @s hotbar.3 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:4b}]
	item replace entity @s hotbar.4 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:5b}]
	item replace entity @s hotbar.5 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:6b}]
	item replace entity @s hotbar.6 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:7b}]
	item replace entity @s hotbar.7 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:8b}]
	item replace entity @s hotbar.8 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:-106b}]
	item replace entity @s weapon.offhand with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:9b}]
	item replace entity @s inventory.0 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:10b}]
	item replace entity @s inventory.1 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:11b}]
	item replace entity @s inventory.2 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:12b}]
	item replace entity @s inventory.3 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:13b}]
	item replace entity @s inventory.4 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:14b}]
	item replace entity @s inventory.5 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:15b}]
	item replace entity @s inventory.6 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:16b}]
	item replace entity @s inventory.7 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:17b}]
	item replace entity @s inventory.8 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:18b}]
	item replace entity @s inventory.9 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:19b}]
	item replace entity @s inventory.10 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:20b}]
	item replace entity @s inventory.11 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:21b}]
	item replace entity @s inventory.12 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:22b}]
	item replace entity @s inventory.13 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:23b}]
	item replace entity @s inventory.14 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:24b}]
	item replace entity @s inventory.15 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:25b}]
	item replace entity @s inventory.16 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:26b}]
	item replace entity @s inventory.17 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:27b}]
	item replace entity @s inventory.18 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:28b}]
	item replace entity @s inventory.19 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:29b}]
	item replace entity @s inventory.20 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:30b}]
	item replace entity @s inventory.21 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:31b}]
	item replace entity @s inventory.22 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:32b}]
	item replace entity @s inventory.23 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:33b}]
	item replace entity @s inventory.24 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:34b}]
	item replace entity @s inventory.25 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:35b}]
	item replace entity @s inventory.26 with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:100b}]
	item replace entity @s armor.feet with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:101b}]
	item replace entity @s armor.legs with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:102b}]
	item replace entity @s armor.chest with minecraft:air
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:103b}]
	item replace entity @s armor.head with minecraft:air
	execute as @e[type=minecraft:armor_stand,tag=graves.new] run {
		name prepare_grave
		block {
			name remove_vanishing_item
			execute store success score #success graves.dummy run data remove entity @s HandItems[0].tag.gravesData.items[{tag:{Enchantments:[{id:"minecraft:vanishing_curse"}]}}]
			execute if score #success graves.dummy matches 1 run function $block
		}
		execute if score #xp graves.config matches 1 if score #xp graves.dummy matches 1.. run {
			name store_xp
			execute store result entity @s HandItems[0].tag.gravesData.xp short 1 run scoreboard players get #xp graves.dummy
			tag @s add graves.hasXP
			scoreboard players set #xp graves.dummy 0
		}
		data modify entity @s HandItems[1].tag.gravesData.uuid set from entity @a[tag=graves.player,limit=1] UUID
		execute store result entity @s HandItems[1].tag.gravesData.id int 1 run scoreboard players get #id graves.dummy
		scoreboard players operation @s graves.id = #id graves.dummy
		data modify entity @s ArmorItems[0] set from entity @s HandItems[1]
		data modify entity @s ArmorItems[1] set from entity @s HandItems[1]
		data modify entity @s ArmorItems[2] set from entity @s HandItems[1]
		data modify entity @s ArmorItems[3] set from entity @s HandItems[1]
		execute store success score #forceloadSuccess graves.dummy run forceload add ~ ~
		execute store result score #graveY graves.dummy run data get entity @s Pos[1]
		scoreboard players set #y graves.dummy -2048
		scoreboard players set #foundBottom graves.dummy 0
		scoreboard players set #bottomY graves.dummy 0
		scoreboard players set #foundTop graves.dummy 0
		execute positioned ~ -2048 ~ run {
			name check_for_world_bottom
			execute if predicate graves:loaded run {
				name found_world_bottom
				scoreboard players set #foundBottom graves.dummy 1
				scoreboard players operation #bottomY graves.dummy = #y graves.dummy
				execute if score #graveY graves.dummy <= #y graves.dummy run {
					name clamp_grave_to_world_bottom
					tp @s ~ ~1 ~
					scoreboard players operation #graveY graves.dummy = #y graves.dummy
					scoreboard players add #graveY graves.dummy 1
				}
				execute if score #graveY graves.dummy > #y graves.dummy positioned ~ ~16 ~ run {
					name check_for_world_top
					scoreboard players add #y graves.dummy 16
					execute unless predicate graves:loaded run {
						name found_world_top
						scoreboard players set #foundTop graves.dummy 1
						execute if score #graveY graves.dummy > #y graves.dummy run {
							name clamp_grave_to_world_top
							tp @s ~ ~ ~
							scoreboard players operation #graveY graves.dummy = #y graves.dummy
						}
					}
					execute if score #foundTop graves.dummy matches 0 positioned ~ ~16 ~ run function graves:check_for_world_top
				}
			}
			execute if score #foundBottom graves.dummy matches 0 run {
				name check_for_world_bottom_above
				scoreboard players add #y graves.dummy 16
				execute unless score #y graves.dummy matches 2048.. positioned ~ ~16 ~ run function graves:check_for_world_bottom
			}
		}
		execute at @s run summon minecraft:marker ~ ~ ~ {Tags:["graves.start"]}
		execute at @s run {
			name try_to_offset_up
			execute unless predicate graves:valid_grave_location positioned ~ ~1 ~ run {
				name offset_up
				tp @s ~ ~ ~
				scoreboard players add #graveY graves.dummy 1
				function graves:try_to_offset_up
			}
			execute if predicate graves:valid_grave_location if entity @e[dx=0,dy=0,dz=0,type=minecraft:armor_stand,tag=!graves.new,nbt=!{Marker:1b}] positioned ~ ~1 ~ run function graves:offset_up
		}
		execute at @s if predicate graves:valid_grave_location unless entity @e[dx=0,dy=0,dz=0,type=minecraft:armor_stand,tag=!graves.new,nbt=!{Marker:1b}] run {
			name try_to_offset_down
			execute if score #graveY graves.dummy > #bottomY graves.dummy positioned ~ ~-1 ~ if predicate graves:valid_grave_location unless entity @e[dx=0,dy=0,dz=0,type=minecraft:armor_stand,tag=!graves.new,nbt=!{Marker:1b}] run {
				name offset_down
				tp @s ~ ~ ~
				scoreboard players remove #graveY graves.dummy 1
				function graves:try_to_offset_down
			}
			execute if score #graveY graves.dummy <= #bottomY graves.dummy at @e[type=minecraft:marker,tag=graves.start] run tp @s ~ ~ ~
		}
		kill @e[type=minecraft:marker,tag=graves.start]
		execute at @s positioned ~ ~-1 ~ if predicate graves:valid_grave_location unless entity @e[dx=0,dy=0,dz=0,type=minecraft:armor_stand,tag=!graves.new,nbt=!{Marker:1b}] run setblock ~ ~ ~ minecraft:grass_block destroy
		execute if score #forceloadSuccess graves.dummy matches 1 run forceload remove ~ ~
		tag @s remove graves.new
		execute at @s run tp @s ~0.5 ~ ~0.5
		execute store result storage graves:storage players[-1].graves[-1].x int 1 run data get entity @s Pos[0]
		execute store result storage graves:storage players[-1].graves[-1].y int 1 run data get entity @s Pos[1]
		execute store result storage graves:storage players[-1].graves[-1].z int 1 run data get entity @s Pos[2]
		execute at @s run {
			name create_model
			summon minecraft:armor_stand ~ ~ ~ {Tags:["graves.marker","graves.model","graves.new"],Marker:1b,Invisible:1b,NoGravity:1b,Invulnerable:1b,ArmorItems:[{},{},{},{id:"minecraft:stone_brick_wall",Count:1b,tag:{gravesData:{}}}],Air:32767s}
			execute as @e[type=minecraft:armor_stand,tag=graves.new] run {
				name prepare_model
				execute store result entity @s ArmorItems[3].tag.gravesData.id int 1 run scoreboard players get #id graves.dummy
				scoreboard players operation @s graves.id = #id graves.dummy
				execute if entity @a[tag=graves.player,y_rotation=-45..45] run tp @s ~ ~ ~ ~90 ~
				execute if entity @a[tag=graves.player,y_rotation=135..225] run tp @s ~ ~ ~ ~90 ~
				tp @s ~ ~-1.375 ~
				tag @s remove graves.new
			}
			loot spawn ~ 1000 ~ loot graves:name_tag
			tag @e[type=minecraft:item,nbt={Item:{tag:{gravesNameTag:1b}}}] add graves.nameTag
			data modify entity @s CustomName set from entity @e[type=minecraft:item,tag=graves.nameTag,limit=1] Item.tag.display.Name
			kill @e[type=minecraft:item,tag=graves.nameTag,limit=1]
		}
		execute if score #locating graves.config matches 1 as @a[tag=graves.player] run tellraw @s [{"text":"Your last grave is at ","color":"COLOR_1"},{"text":"(","color":"COLOR_2"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].x","color":"COLOR_2"},{"text":", ","color":"COLOR_2"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].y","color":"COLOR_2"},{"text":", ","color":"COLOR_2"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].z","color":"COLOR_2"},{"text":")","color":"COLOR_2"},{"text":" in ","color":"COLOR_1"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].dim"},{"text":".","color":"COLOR_1"}]
	}
	tag @s remove graves.player
}
function drop_xp {
	summon minecraft:experience_orb ~ ~0.2 ~ {Tags:["graves.xp"]}
	execute store result entity @e[type=minecraft:experience_orb,tag=graves.xp,limit=1] Value short 1 run scoreboard players get #xp graves.dummy
	tag @e[type=minecraft:experience_orb] remove graves.xp
}
dir rotate {
	function players {
		execute store result score #remaining graves.dummy run data get storage graves:storage players
		data modify storage graves:storage temp set from entity @s UUID
		execute store success score #success graves.dummy run data modify storage graves:storage temp set from storage graves:storage players[-1].uuid
		execute unless score #remaining graves.dummy matches 0 if score #success graves.dummy matches 1 run function graves:rotate/player
		execute if score #remaining graves.dummy matches 0 run {
			name add_player
			data modify storage graves:storage players append value {graves:[]}
			data modify storage graves:storage players[-1].uuid set from entity @s UUID
		}
	}
	function player {
		data modify storage graves:storage players prepend from storage graves:storage players[-1]
		data remove storage graves:storage players[-1]
		scoreboard players remove #remaining graves.dummy 1
		data modify storage graves:storage temp set from entity @s UUID
		execute store success score #success graves.dummy run data modify storage graves:storage temp set from storage graves:storage players[-1].uuid
		execute unless score #remaining graves.dummy matches 0 if score #success graves.dummy matches 1 run function $block
	}
	function player_as_grave {
		data modify storage graves:storage players prepend from storage graves:storage players[-1]
		data remove storage graves:storage players[-1]
		scoreboard players remove #remaining graves.dummy 1
		data modify storage graves:storage temp set from entity @s HandItems[1].tag.gravesData.uuid
		execute store success score #success graves.dummy run data modify storage graves:storage temp set from storage graves:storage players[-1].uuid
		execute unless score #remaining graves.dummy matches 0 if score #success graves.dummy matches 1 run function $block
	}
	function graves {
		execute store result score #remaining graves.dummy run data get storage graves:storage players[-1].graves
		execute store result score #id graves.dummy run data get storage graves:storage players[-1].graves[-1].id
		execute unless score #remaining graves.dummy matches 0 unless score #id graves.dummy = #activated graves.dummy run function graves:rotate/grave
	}
	function grave {
		data modify storage graves:storage players[-1].graves prepend from storage graves:storage players[-1].graves[-1]
		data remove storage graves:storage players[-1].graves[-1]
		scoreboard players add #rotated graves.dummy 1
		scoreboard players remove #remaining graves.dummy 1
		execute store result score #id graves.dummy run data get storage graves:storage players[-1].graves[-1].id
		execute unless score #remaining graves.dummy matches 0 unless score #id graves.dummy = #activated graves.dummy run function $block
	}
	function back_grave {
		data modify storage graves:storage players[-1].graves prepend from storage graves:storage players[-1].graves[-1]
		data remove storage graves:storage players[-1].graves[-1]
		scoreboard players remove #remaining graves.dummy 1
		execute unless score #remaining graves.dummy matches 0 run function $block
	}
}
function config {
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	tellraw @s ["                        Graves",{"text":" / ","color":"gray"},"Global Settings                        "]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	execute if score #robbing graves.config matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function graves:config/disable_robbing"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to disable ","color":"red"},"Grave Robbing",{"text":".","color":"red"},{"text":"\nWhen enabled, players can open graves they do not own.","color":"gray"},{"text":"\nDefault: Disabled","color":"dark_gray"}]}}," Grave Robbing"]
	execute unless score #robbing graves.config matches 1 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function graves:config/enable_robbing"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enable ","color":"green"},"Grave Robbing",{"text":".","color":"green"},{"text":"\nWhen enabled, players can open graves they do not own.","color":"gray"},{"text":"\nDefault: Disabled","color":"dark_gray"}]}}," Grave Robbing"]
	execute if score #xp graves.config matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function graves:config/disable_xp"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to disable ","color":"red"},"XP Collection",{"text":".","color":"red"},{"text":"\nWhen enabled, graves collect XP dropped on death.\nNote that players do not drop all their XP on death.","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," XP Collection"]
	execute unless score #xp graves.config matches 1 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function graves:config/enable_xp"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enable ","color":"green"},"XP Collection",{"text":".","color":"green"},{"text":"\nWhen enabled, graves collect XP dropped on death.\nNote that players do not drop all their XP on death.","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," XP Collection"]
	execute if score #locating graves.config matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function graves:config/disable_locating"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to disable ","color":"red"},"Grave Locating",{"text":".","color":"red"},{"text":"\nWhen enabled, players can see the coordinates of their last grave.","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," Grave Locating"]
	execute unless score #locating graves.config matches 1 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function graves:config/enable_locating"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enable ","color":"green"},"Grave Locating",{"text":".","color":"green"},{"text":"\nWhen enabled, players can see the coordinates of their last grave.","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," Grave Locating"]
	tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #despawn graves.config "},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enter the number of seconds after which a grave is deleted.\nA grave's despawn timer only runs while the grave is loaded.\nEnter ","color":"gray"},"0",{"text":" to disable grave despawning.\nItems normally take ","color":"gray"},"300",{"text":" seconds (5 minutes) to despawn.","color":"gray"},{"text":"\nAccepts: whole numbers 0+\nDefault: 0","color":"dark_gray"}]}}," Grave Despawn Time ",{"text":"(Current: ","color":"gray"},{"score":{"name":"#despawn","objective":"graves.config"},"color":"gray"},{"text":")","color":"gray"}]
	tellraw @s ["",{"text":">> ","color":"gold"},{"text":"[ Receive Grave Key ]","clickEvent":{"action":"run_command","value":"/function graves:give_grave_key"},"hoverEvent":{"action":"show_text","contents":{"text":"Click to receive a grave key which can be used to forcibly open graves.","color":"gray"}}}]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	execute store result score #sendCommandFeedback graves.config run gamerule sendCommandFeedback
	execute if score #sendCommandFeedback graves.config matches 1 run {
		name hide_command_feedback
		gamerule sendCommandFeedback false
		schedule 1t replace {
			name restore_command_feedback
			gamerule sendCommandFeedback true
		}
	}
}
dir config {
	function enable_robbing {
		scoreboard players set #robbing graves.config 1
		function graves:config
	}
	function disable_robbing {
		scoreboard players set #robbing graves.config 0
		function graves:config
	}
	function enable_xp {
		scoreboard players set #xp graves.config 1
		function graves:config
	}
	function disable_xp {
		scoreboard players set #xp graves.config 0
		function graves:config
	}
	function enable_locating {
		scoreboard players set #locating graves.config 1
		function graves:config
	}
	function disable_locating {
		scoreboard players set #locating graves.config 0
		function graves:config
	}
}
function give_grave_key {
	give @s minecraft:player_head{gravesKey:1b,display:{Name:'["",{"text":"Grave Key","italic":false,"color":"yellow"}]',Lore:['{"text":"Right-click a grave while holding exactly one of this to forcibly open it.","color":"gray","italic":false}','{"text":"Placing this down will break its functionality.","color":"gray","italic":false}']},SkullOwner:{Id:[I;0,0,0,0],Properties:{textures:[{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWVjNzA3NjllMzYzN2E3ZWRiNTcwMmJjYzQzM2NjMjQyYzJmMjIzNWNiNzNiOTQwODBmYjVmYWZmNDdiNzU0ZSJ9fX0="}]}}}
}
