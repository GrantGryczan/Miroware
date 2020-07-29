function load {
	scoreboard objectives add cauCon.success dummy
	execute unless entity a093751a-2c77-4658-9d5f-62ab4494bdaf positioned 16562064 1000 -22242912 run function cauldron_concrete:summon_marker
}
function uninstall {
	scoreboard objectives remove cauCon.success
	kill a093751a-2c77-4658-9d5f-62ab4494bdaf
	forceload remove 16562064 -22242912
	schedule clear cauldron_concrete:tick
}
clock 1t {
	name tick
	execute as @e[type=minecraft:item] at @s if block ~ ~ ~ minecraft:cauldron unless block ~ ~ ~ minecraft:cauldron[level=0] run function cauldron_concrete:check_item
}
function summon_marker {
	forceload add ~ ~
	summon minecraft:armor_stand ~ ~ ~ {Marker:1b,NoGravity:1b,Invulnerable:1b,Invisible:1b,UUID:[I;-1600948966,746014296,-1654693205,1150598575]}
}
function harden {
	data modify entity @s[nbt={Item:{id:"minecraft:white_concrete_powder"}}] Item.id set value "minecraft:white_concrete"
	data modify entity @s[nbt={Item:{id:"minecraft:orange_concrete_powder"}}] Item.id set value "minecraft:orange_concrete"
	data modify entity @s[nbt={Item:{id:"minecraft:magenta_concrete_powder"}}] Item.id set value "minecraft:magenta_concrete"
	data modify entity @s[nbt={Item:{id:"minecraft:light_blue_concrete_powder"}}] Item.id set value "minecraft:light_blue_concrete"
	data modify entity @s[nbt={Item:{id:"minecraft:yellow_concrete_powder"}}] Item.id set value "minecraft:yellow_concrete"
	data modify entity @s[nbt={Item:{id:"minecraft:lime_concrete_powder"}}] Item.id set value "minecraft:lime_concrete"
	data modify entity @s[nbt={Item:{id:"minecraft:pink_concrete_powder"}}] Item.id set value "minecraft:pink_concrete"
	data modify entity @s[nbt={Item:{id:"minecraft:gray_concrete_powder"}}] Item.id set value "minecraft:gray_concrete"
	data modify entity @s[nbt={Item:{id:"minecraft:light_gray_concrete_powder"}}] Item.id set value "minecraft:light_gray_concrete"
	data modify entity @s[nbt={Item:{id:"minecraft:cyan_concrete_powder"}}] Item.id set value "minecraft:cyan_concrete"
	data modify entity @s[nbt={Item:{id:"minecraft:purple_concrete_powder"}}] Item.id set value "minecraft:purple_concrete"
	data modify entity @s[nbt={Item:{id:"minecraft:blue_concrete_powder"}}] Item.id set value "minecraft:blue_concrete"
	data modify entity @s[nbt={Item:{id:"minecraft:brown_concrete_powder"}}] Item.id set value "minecraft:brown_concrete"
	data modify entity @s[nbt={Item:{id:"minecraft:green_concrete_powder"}}] Item.id set value "minecraft:green_concrete"
	data modify entity @s[nbt={Item:{id:"minecraft:red_concrete_powder"}}] Item.id set value "minecraft:red_concrete"
	data modify entity @s[nbt={Item:{id:"minecraft:black_concrete_powder"}}] Item.id set value "minecraft:black_concrete"
}
function check_item {
	tag @s add cauCon.subject
	data modify entity a093751a-2c77-4658-9d5f-62ab4494bdaf HandItems[0] set from entity @s Item
	execute as a093751a-2c77-4658-9d5f-62ab4494bdaf if predicate cauldron_concrete:concrete_powder as @e[type=minecraft:item,tag=cauCon.subject] run function cauldron_concrete:harden
	tag @s remove cauCon.subject
}
