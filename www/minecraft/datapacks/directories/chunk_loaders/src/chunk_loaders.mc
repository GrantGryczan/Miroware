function load {
	scoreboard objectives add chuLoa.dummy dummy
}
function uninstall {
	scoreboard objectives remove chuLoa.dummy
	schedule clear chunk_loaders:tick
	schedule clear chunk_loaders:schedule
	execute as @e[type=minecraft:item_frame,tag=chuLoa.marker] at @s run function chunk_loaders:destroy_chunk_loader
}
clock 1t {
	name tick
	execute as @e[type=minecraft:item_frame,tag=chuLoa.marker] at @s unless block ~ ~ ~ minecraft:lodestone run {
		name destroy_chunk_loader
		forceload remove ~ ~
		execute store result score #doTileDrops chuLoa.dummy run gamerule doTileDrops
		execute if score #doTileDrops chuLoa.dummy matches 1 run summon minecraft:item ~ ~0.5 ~ {Item:{id:"minecraft:nether_star",Count:1b},PickupDelay:10s}
		particle minecraft:smoke ~ ~0.5 ~ 0.25 0.25 0.25 0.02 150
		playsound minecraft:block.respawn_anchor.deplete block @a ~ ~ ~ 1 0.5
		kill @s
	}
}
clock 1s {
	name schedule
	execute as @e[type=minecraft:item] at @s positioned ~ ~-0.25 ~ if block ~ ~ ~ minecraft:lodestone align xyz unless entity @e[type=minecraft:item_frame,tag=chuLoa.marker,dx=0,dy=0,dz=0] if entity @s[nbt={Item:{id:"minecraft:nether_star",Count:1b}}] run {
		name try_to_create_chunk_loader
		execute store success score #success chuLoa.dummy run forceload add ~ ~
		execute if score #success chuLoa.dummy matches 1 run {
			name create_chunk_loader
			summon minecraft:item_frame ~ ~ ~ {Tags:["chuLoa.marker"],Fixed:1b,Invisible:1b,Facing:1b}
			particle minecraft:smoke ~0.5 ~0.5 ~0.5 0.4 0.4 0.4 0.02 150
			playsound minecraft:block.respawn_anchor.charge block @a ~ ~ ~ 1 0.5
			kill @s
		}
		execute unless score #success chuLoa.dummy matches 1 run data merge entity @s {CustomName:'{"text":"This chunk is already force-loaded.","color":"red"}',CustomNameVisible:1b}
	}
	execute at @e[type=minecraft:item_frame,tag=chuLoa.marker] align xyz run particle minecraft:smoke ~0.5 ~0.5 ~0.5 0.25 0.25 0.25 0.02 4
}
