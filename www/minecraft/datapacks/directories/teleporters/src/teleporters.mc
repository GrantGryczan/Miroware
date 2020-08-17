function load {
	scoreboard objectives add tpers.dummy dummy
}
function uninstall {
	scoreboard objectives remove tpers.dummy
	schedule clear teleporters:tick
}
clock 1t {
	name tick
	execute as @e[type=minecraft:item_frame,tag=tpers.gateway] at @s run {
		name tick_gateway
		execute if block ~ ~ ~ minecraft:crying_obsidian if block ~ ~2 ~ minecraft:crying_obsidian if block ~ ~1 ~ minecraft:end_gateway run tag @s add tpers.valid
		execute unless entity @s[tag=tpers.valid] align xyz positioned ~0.5 ~1.5 ~0.5 run {
			name destroy_gateway
			summon minecraft:item ~ ~ ~ {Tags:["tpers.compass"],PickupDelay:10s,Item:{id:"minecraft:compass",Count:1b}}
			data modify entity @e[type=minecraft:item,tag=tpers.compass,limit=1] Item set from entity @s Item
			tag @e[type=minecraft:item,tag=tpers.compass] add tpers.done
			tag @e[type=minecraft:item] remove tpers.compass
			execute if block ~ ~ ~ minecraft:end_gateway run setblock ~ ~ ~ minecraft:air destroy
			playsound minecraft:block.beacon.deactivate block @a ~ ~ ~
			particle minecraft:reverse_portal ~ ~ ~ 0.25 0.25 0.25 0.25 250
			kill @s
		}
		tag @s remove tpers.valid
	}
	execute as @e[type=minecraft:item,tag=!tpers.done] at @s if block ~ ~1 ~ minecraft:crying_obsidian if block ~ ~-1 ~ minecraft:crying_obsidian if block ~ ~ ~ #teleporters:air if entity @s[nbt={Item:{id:"minecraft:compass",Count:1b,tag:{LodestoneTracked:1b}}}] run {
		name test_compass
		data modify entity @s Item.tag.tpersDimension set from entity @s Item.tag.LodestoneDimension
		execute store success score @s tpers.dummy run data modify entity @s Item.tag.tpersDimension set from entity @a[distance=0..,limit=1] Dimension
		data remove entity @s Item.tag.tpersDimension
		execute unless data entity @s Item.tag.LodestonePos run scoreboard players set @s tpers.dummy 1
		execute if score @s tpers.dummy matches 1 run {
			name fail
			data merge entity @s {CustomName:'{"text":"This compass has no lodestone in this dimension.","color":"red"}',CustomNameVisible:1b}
			tag @s add tpers.done
		}
		execute if score @s tpers.dummy matches 0 align xyz positioned ~0.5 ~0.5 ~0.5 run {
			name create_gateway
			setblock ~ ~ ~ minecraft:end_gateway{ExactTeleport:1b}
			data modify block ~ ~ ~ ExitPortal set from entity @s Item.tag.LodestonePos
			execute store result score @s tpers.dummy run data get block ~ ~ ~ ExitPortal.Y
			scoreboard players add @s tpers.dummy 1
			execute store result block ~ ~ ~ ExitPortal.Y int 1 run scoreboard players get @s tpers.dummy
			summon minecraft:item_frame ~ ~-1 ~ {Tags:["tpers.gateway","tpers.new"],Fixed:1b,Invisible:1b}
			data modify entity @e[type=minecraft:item_frame,tag=tpers.new,limit=1] Item set from entity @s Item
			tag @e[type=minecraft:item_frame] remove tpers.new
			playsound minecraft:block.beacon.activate block @a
			kill @s
		}
	}
}
