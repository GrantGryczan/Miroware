function load {
	scoreboard objectives add elevs.dummy dummy
	scoreboard objectives add elevs.jump minecraft.custom:minecraft.jump
	scoreboard objectives add elevs.sneak minecraft.custom:minecraft.sneak_time
	scoreboard objectives add elevs.prevSneak dummy
	scoreboard players reset * elevs.jump
	scoreboard players reset * elevs.sneak
	scoreboard players reset * elevs.prevSneak
}
function uninstall {
	schedule clear elevators:tick
	schedule clear elevators:check_items
	schedule clear elevators:create_particles
	scoreboard objectives remove elevs.dummy
	scoreboard objectives remove elevs.jump
	scoreboard objectives remove elevs.sneak
	scoreboard objectives remove elevs.prevSneak
}
clock 1t {
	name tick
	execute as @e[type=minecraft:item_frame,tag=elevs.marker] at @s unless block ~ ~ ~ #minecraft:wool run {
		name destroy_elevator
		execute store result score #doTileDrops elevs.dummy run gamerule doTileDrops
		execute if score #doTileDrops elevs.dummy matches 1 run summon minecraft:item ~ ~0.5 ~ {Item:{id:"minecraft:ender_pearl",Count:1b},PickupDelay:10s}
		kill @s
	}
	execute as @a[scores={elevs.jump=1..}] at @s run {
		name jump
		execute unless entity @s[gamemode=spectator] if block ~ ~-1 ~ #minecraft:wool positioned ~ ~-1 ~ align xyz if entity @e[type=minecraft:item_frame,tag=elevs.marker,dx=0,dy=0,dz=0] at @s run {
			name start_to_offset_up
			execute if block ~ ~-1 ~ minecraft:white_wool run scoreboard players set #color elevs.dummy 0
			execute if block ~ ~-1 ~ minecraft:orange_wool run scoreboard players set #color elevs.dummy 1
			execute if block ~ ~-1 ~ minecraft:magenta_wool run scoreboard players set #color elevs.dummy 2
			execute if block ~ ~-1 ~ minecraft:light_blue_wool run scoreboard players set #color elevs.dummy 3
			execute if block ~ ~-1 ~ minecraft:yellow_wool run scoreboard players set #color elevs.dummy 4
			execute if block ~ ~-1 ~ minecraft:lime_wool run scoreboard players set #color elevs.dummy 5
			execute if block ~ ~-1 ~ minecraft:pink_wool run scoreboard players set #color elevs.dummy 6
			execute if block ~ ~-1 ~ minecraft:gray_wool run scoreboard players set #color elevs.dummy 7
			execute if block ~ ~-1 ~ minecraft:light_gray_wool run scoreboard players set #color elevs.dummy 8
			execute if block ~ ~-1 ~ minecraft:cyan_wool run scoreboard players set #color elevs.dummy 9
			execute if block ~ ~-1 ~ minecraft:purple_wool run scoreboard players set #color elevs.dummy 10
			execute if block ~ ~-1 ~ minecraft:blue_wool run scoreboard players set #color elevs.dummy 11
			execute if block ~ ~-1 ~ minecraft:brown_wool run scoreboard players set #color elevs.dummy 12
			execute if block ~ ~-1 ~ minecraft:green_wool run scoreboard players set #color elevs.dummy 13
			execute if block ~ ~-1 ~ minecraft:red_wool run scoreboard players set #color elevs.dummy 14
			execute if block ~ ~-1 ~ minecraft:black_wool run scoreboard players set #color elevs.dummy 15
			tag @s add elevs.continue
			block {
				name offset_up
				execute if block ~ ~ ~ #minecraft:wool align xyz if entity @e[type=minecraft:item_frame,tag=elevs.marker,dx=0,dy=0,dz=0] run function elevators:check_color
				execute unless entity @s[tag=elevs.continue] positioned ~ ~1.1 ~ run function elevators:teleport
				execute if entity @s[tag=elevs.continue] if predicate elevators:loaded positioned ~ ~1 ~ align y run function $block
			}
			tag @s remove elevs.continue
		}
		scoreboard players reset @s elevs.jump
	}
	execute as @a[scores={elevs.sneak=1..}] at @s run {
		name sneak
		execute if score @s[gamemode=!spectator] elevs.sneak matches 1 if block ~ ~-1 ~ #minecraft:wool positioned ~ ~-1 ~ align xyz if entity @e[type=minecraft:item_frame,tag=elevs.marker,dx=0,dy=0,dz=0] at @s run {
			name start_to_offset_down
			execute if block ~ ~-1 ~ minecraft:white_wool run scoreboard players set #color elevs.dummy 0
			execute if block ~ ~-1 ~ minecraft:orange_wool run scoreboard players set #color elevs.dummy 1
			execute if block ~ ~-1 ~ minecraft:magenta_wool run scoreboard players set #color elevs.dummy 2
			execute if block ~ ~-1 ~ minecraft:light_blue_wool run scoreboard players set #color elevs.dummy 3
			execute if block ~ ~-1 ~ minecraft:yellow_wool run scoreboard players set #color elevs.dummy 4
			execute if block ~ ~-1 ~ minecraft:lime_wool run scoreboard players set #color elevs.dummy 5
			execute if block ~ ~-1 ~ minecraft:pink_wool run scoreboard players set #color elevs.dummy 6
			execute if block ~ ~-1 ~ minecraft:gray_wool run scoreboard players set #color elevs.dummy 7
			execute if block ~ ~-1 ~ minecraft:light_gray_wool run scoreboard players set #color elevs.dummy 8
			execute if block ~ ~-1 ~ minecraft:cyan_wool run scoreboard players set #color elevs.dummy 9
			execute if block ~ ~-1 ~ minecraft:purple_wool run scoreboard players set #color elevs.dummy 10
			execute if block ~ ~-1 ~ minecraft:blue_wool run scoreboard players set #color elevs.dummy 11
			execute if block ~ ~-1 ~ minecraft:brown_wool run scoreboard players set #color elevs.dummy 12
			execute if block ~ ~-1 ~ minecraft:green_wool run scoreboard players set #color elevs.dummy 13
			execute if block ~ ~-1 ~ minecraft:red_wool run scoreboard players set #color elevs.dummy 14
			execute if block ~ ~-1 ~ minecraft:black_wool run scoreboard players set #color elevs.dummy 15
			tag @s add elevs.continue
			execute positioned ~ ~-2 ~ run {
				name offset_down
				execute if block ~ ~ ~ #minecraft:wool align xyz if entity @e[type=minecraft:item_frame,tag=elevs.marker,dx=0,dy=0,dz=0] run function elevators:check_color
				execute unless entity @s[tag=elevs.continue] positioned ~ ~1.1 ~ run function elevators:teleport
				execute if entity @s[tag=elevs.continue] if predicate elevators:loaded positioned ~ ~-1 ~ align y run function $block
			}
			tag @s remove elevs.continue
		}
		execute if score @s elevs.prevSneak = @s elevs.sneak run {
			name stop_sneaking
			scoreboard players reset @s elevs.prevSneak
			scoreboard players reset @s elevs.sneak
		}
		scoreboard players operation @s elevs.prevSneak = @s elevs.sneak
	}
}
clock 1s {
	name check_items
	execute as @e[type=minecraft:item] at @s positioned ~ ~-0.25 ~ if block ~ ~ ~ #minecraft:wool align xyz unless entity @e[type=minecraft:item_frame,tag=elevs.marker,dx=0,dy=0,dz=0] if entity @s[nbt={Item:{id:"minecraft:ender_pearl",Count:1b}}] run {
		name create_elevator
		summon minecraft:item_frame ~ ~ ~ {Tags:["elevs.marker"],Fixed:1b,Invisible:1b,Facing:1b}
		particle minecraft:portal ~0.5 ~0.5 ~0.5 0.5 0.5 0.5 1 200
		kill @s
	}
}
clock 10t {
	name create_particles
	execute at @e[type=minecraft:item_frame,tag=elevs.marker] run particle minecraft:reverse_portal ~ ~1 ~ 0.25 0 0.25 0.02 1
}
function check_color {
	execute if score #color elevs.dummy matches 0 if block ~ ~ ~ minecraft:white_wool run tag @s remove elevs.continue
	execute if score #color elevs.dummy matches 1 if block ~ ~ ~ minecraft:orange_wool run tag @s remove elevs.continue
	execute if score #color elevs.dummy matches 2 if block ~ ~ ~ minecraft:magenta_wool run tag @s remove elevs.continue
	execute if score #color elevs.dummy matches 3 if block ~ ~ ~ minecraft:light_blue_wool run tag @s remove elevs.continue
	execute if score #color elevs.dummy matches 4 if block ~ ~ ~ minecraft:yellow_wool run tag @s remove elevs.continue
	execute if score #color elevs.dummy matches 5 if block ~ ~ ~ minecraft:lime_wool run tag @s remove elevs.continue
	execute if score #color elevs.dummy matches 6 if block ~ ~ ~ minecraft:pink_wool run tag @s remove elevs.continue
	execute if score #color elevs.dummy matches 7 if block ~ ~ ~ minecraft:gray_wool run tag @s remove elevs.continue
	execute if score #color elevs.dummy matches 8 if block ~ ~ ~ minecraft:light_gray_wool run tag @s remove elevs.continue
	execute if score #color elevs.dummy matches 9 if block ~ ~ ~ minecraft:cyan_wool run tag @s remove elevs.continue
	execute if score #color elevs.dummy matches 10 if block ~ ~ ~ minecraft:purple_wool run tag @s remove elevs.continue
	execute if score #color elevs.dummy matches 11 if block ~ ~ ~ minecraft:blue_wool run tag @s remove elevs.continue
	execute if score #color elevs.dummy matches 12 if block ~ ~ ~ minecraft:brown_wool run tag @s remove elevs.continue
	execute if score #color elevs.dummy matches 13 if block ~ ~ ~ minecraft:green_wool run tag @s remove elevs.continue
	execute if score #color elevs.dummy matches 14 if block ~ ~ ~ minecraft:red_wool run tag @s remove elevs.continue
	execute if score #color elevs.dummy matches 15 if block ~ ~ ~ minecraft:black_wool run tag @s remove elevs.continue
}
function teleport {
	execute at @s run playsound minecraft:entity.enderman.teleport player @a ~ ~ ~ 0.4
	tp @s ~ ~ ~
	playsound minecraft:entity.enderman.teleport player @a ~ ~ ~ 0.4
}
