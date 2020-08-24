function load {
	scoreboard objectives add graves.config dummy "Graves Config"
	scoreboard objectives add graves.deaths deathCount
	scoreboard objectives add graves.id dummy
	scoreboard objectives add graves.dummy dummy
	scoreboard objectives add grave trigger "Locate Last Grave"
	execute unless score #robbing graves.config matches 0..1 run scoreboard players set #robbing graves.config 0
	execute unless score #xp graves.config matches 0..1 run scoreboard players set #xp graves.config 1
	execute unless score #locating graves.config matches 0..1 run scoreboard players set #locating graves.config 1
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
	scoreboard objectives remove grave
	data remove storage graves:storage players
	data remove storage graves:storage lastGrave
	data remove storage graves:storage temp
}
clock 1t {
	name tick
	execute as @a[scores={graves.deaths=1..}] run {
		name death
		execute at @s[gamemode=!spectator] run {
			name drop_inventory
			execute store result score #xp graves.dummy run data get entity @s XpLevel
			scoreboard players operation #xp graves.dummy *= #pointsPerLevel graves.dummy
			execute if score #xp graves.dummy matches 101.. run scoreboard players set #xp graves.dummy 100
			execute unless score #xp graves.config matches 1 if score #xp graves.dummy matches 1.. run function graves:drop_xp
			execute if data entity @s Inventory[0] align xyz run function graves:create_grave
			execute if score #xp graves.config matches 1 if score #xp graves.dummy matches 1.. align xyz run function graves:create_grave
			xp set @s 0 levels
			xp set @s 0 points
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
			execute if score #success graves.dummy matches 1 run tellraw @s [{"text":"Your last grave is at ","color":"dark_aqua"},{"text":"(","color":"aqua"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].x","color":"aqua"},{"text":", ","color":"aqua"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].y","color":"aqua"},{"text":", ","color":"aqua"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].z","color":"aqua"},{"text":")","color":"aqua"},{"text":" in ","color":"dark_aqua"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].dim"},{"text":".","color":"dark_aqua"}]
			execute unless score #success graves.dummy matches 1 run tellraw @s {"text":"You do not have a last grave.","color":"red"}
		}
		scoreboard players set @a grave 0
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
					execute store result score #count graves.dummy run data get entity @s ArmorItems[<%this.i%>].Count
					execute if score #count graves.dummy matches 1 run {
						name fix_equipment/check_<%this.i%>
						execute if entity @a[tag=graves.subject,gamemode=creative] run {
							name fix_equipment/drop_<%this.i%>
							summon minecraft:item ~ ~ ~ {Tags:["graves.item"],Item:{id:"minecraft:stone_button",Count:1b}}
							data modify entity @e[type=minecraft:item,tag=graves.item,limit=1] Item set from entity @s ArmorItems[<%this.i%>]
							data modify entity @e[type=minecraft:item,tag=graves.item,limit=1] Owner set from entity @a[tag=graves.subject,limit=1] UUID
							tag @e[type=minecraft:item] remove graves.item
						}
						execute unless entity @a[tag=graves.subject,gamemode=creative] unless data entity @s ArmorItems[<%this.i%>].tag.gravesKey run function graves:fix_equipment/drop_<%this.i%>
					}
					execute unless score #count graves.dummy matches 2 run data modify entity @s ArmorItems[<%this.i%>] set from entity @s HandItems[1]
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
					name check_model
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
	data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items set from entity @s Inventory
	replaceitem entity @s hotbar.0 minecraft:air
	replaceitem entity @s hotbar.1 minecraft:air
	replaceitem entity @s hotbar.2 minecraft:air
	replaceitem entity @s hotbar.3 minecraft:air
	replaceitem entity @s hotbar.4 minecraft:air
	replaceitem entity @s hotbar.5 minecraft:air
	replaceitem entity @s hotbar.6 minecraft:air
	replaceitem entity @s hotbar.7 minecraft:air
	replaceitem entity @s hotbar.8 minecraft:air
	replaceitem entity @s weapon.offhand minecraft:air
	replaceitem entity @s inventory.0 minecraft:air
	replaceitem entity @s inventory.1 minecraft:air
	replaceitem entity @s inventory.2 minecraft:air
	replaceitem entity @s inventory.3 minecraft:air
	replaceitem entity @s inventory.4 minecraft:air
	replaceitem entity @s inventory.5 minecraft:air
	replaceitem entity @s inventory.6 minecraft:air
	replaceitem entity @s inventory.7 minecraft:air
	replaceitem entity @s inventory.8 minecraft:air
	replaceitem entity @s inventory.9 minecraft:air
	replaceitem entity @s inventory.10 minecraft:air
	replaceitem entity @s inventory.11 minecraft:air
	replaceitem entity @s inventory.12 minecraft:air
	replaceitem entity @s inventory.13 minecraft:air
	replaceitem entity @s inventory.14 minecraft:air
	replaceitem entity @s inventory.15 minecraft:air
	replaceitem entity @s inventory.16 minecraft:air
	replaceitem entity @s inventory.17 minecraft:air
	replaceitem entity @s inventory.18 minecraft:air
	replaceitem entity @s inventory.19 minecraft:air
	replaceitem entity @s inventory.20 minecraft:air
	replaceitem entity @s inventory.21 minecraft:air
	replaceitem entity @s inventory.22 minecraft:air
	replaceitem entity @s inventory.23 minecraft:air
	replaceitem entity @s inventory.24 minecraft:air
	replaceitem entity @s inventory.25 minecraft:air
	replaceitem entity @s inventory.26 minecraft:air
	replaceitem entity @s armor.feet minecraft:air
	replaceitem entity @s armor.legs minecraft:air
	replaceitem entity @s armor.chest minecraft:air
	replaceitem entity @s armor.head minecraft:air
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
		execute store result score #y graves.dummy run data get entity @s Pos[1]
		execute if score #y graves.dummy matches ..0 run tp @s ~ 1 ~
		execute at @s run summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["graves.start"]}
		execute at @s run {
			name offset_up
			tp @s ~ ~ ~
			execute unless predicate graves:valid positioned ~ ~1 ~ run function $block
			execute if predicate graves:valid if entity @e[dx=0,dy=0,dz=0,type=minecraft:armor_stand,tag=!graves.new,nbt=!{Marker:1b}] positioned ~ ~1 ~ run function $block
		}
		execute at @s if predicate graves:valid unless entity @e[dx=0,dy=0,dz=0,type=minecraft:armor_stand,tag=!graves.new,nbt=!{Marker:1b}] run {
			name offset_down
			tp @s ~ ~ ~
			execute unless entity @s[y=0,dy=0] positioned ~ ~-1 ~ if predicate graves:valid unless entity @e[dx=0,dy=0,dz=0,type=minecraft:armor_stand,tag=!graves.new,nbt=!{Marker:1b}] run function $block
			execute if entity @s[y=0,dy=0] at @e[type=minecraft:area_effect_cloud,tag=graves.start] run tp @s ~ ~ ~
		}
		kill @e[type=minecraft:area_effect_cloud,tag=graves.start]
		execute at @s positioned ~ ~-1 ~ if predicate graves:valid unless entity @e[dx=0,dy=0,dz=0,type=minecraft:armor_stand,tag=!graves.new,nbt=!{Marker:1b}] run setblock ~ ~ ~ minecraft:grass_block
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
			execute as @e[type=minecraft:item,tag=graves.nameTag,limit=1] run {
				name kill_item
				data modify entity @s Item.Count set value 0b
				kill @s
			}
		}
		execute if score #locating graves.config matches 1 as @a[tag=graves.player] run tellraw @s [{"text":"Your last grave is at ","color":"dark_aqua"},{"text":"(","color":"aqua"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].x","color":"aqua"},{"text":", ","color":"aqua"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].y","color":"aqua"},{"text":", ","color":"aqua"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].z","color":"aqua"},{"text":")","color":"aqua"},{"text":" in ","color":"dark_aqua"},{"storage":"graves:storage","nbt":"players[-1].graves[-1].dim"},{"text":".","color":"dark_aqua"}]
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
	give @s minecraft:player_head{gravesKey:1b,display:{Name:'["",{"text":"Grave Key","italic":false,"color":"yellow"}]',Lore:['"Right-click a grave with this to forcibly open it."','"Placing this down will break its functionality."']},SkullOwner:{Id:[I;0,0,0,0],Properties:{textures:[{Value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMWVjNzA3NjllMzYzN2E3ZWRiNTcwMmJjYzQzM2NjMjQyYzJmMjIzNWNiNzNiOTQwODBmYjVmYWZmNDdiNzU0ZSJ9fX0="}]}}}
}
