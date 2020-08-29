function load {
	scoreboard objectives add pocDim.give dummy "Give Pocket Dimension Item"
	scoreboard objectives add pocDim.dummy dummy
	scoreboard objectives add pocDim.id dummy
	scoreboard objectives add pocDim.time dummy
	scoreboard objectives add pocDim.tier dummy
	scoreboard players set #scale pocDim.dummy 1024
	scoreboard players set #offsetScale pocDim.dummy 4
	execute unless score #last pocDim.dummy matches 0.. run scoreboard players set #last pocDim.dummy 0
	execute in pocket_dimensions:dimension run forceload add 0 1024
	advancement revoke @a only pocket_dimensions:drink_potion
}
function uninstall {
	scoreboard objectives remove pocDim.give
	scoreboard objectives remove pocDim.dummy
	scoreboard objectives remove pocDim.id
	scoreboard objectives remove pocDim.time
	scoreboard objectives remove pocDim.tier
	data remove storage pocket_dimensions:storage pockets
	schedule clear pocket_dimensions:tick
}
clock 1t {
	name tick
	execute as @a[scores={pocDim.give=1..}] at @s run function pocket_dimensions:try_to_give
	execute as @a[advancements={pocket_dimensions:drink_potion=true}] run function pocket_dimensions:drink_potion
	execute as @a[scores={pocDim.id=1..},predicate=pocket_dimensions:loaded] at @s unless block ~ 0 ~ minecraft:barrier run kill @s
	execute as @a[predicate=pocket_dimensions:outside_pocket_dimension] at @s run scoreboard players set @s pocDim.id 0
	execute as @e[type=minecraft:enderman] at @s positioned ~ ~0.2 ~ if block ~ ~-1 ~ minecraft:beacon if block ~-1 ~-2 ~-1 #minecraft:beacon_base_blocks if block ~-1 ~-2 ~ #minecraft:beacon_base_blocks if block ~-1 ~-2 ~1 #minecraft:beacon_base_blocks if block ~ ~-2 ~-1 #minecraft:beacon_base_blocks if block ~ ~-2 ~ #minecraft:beacon_base_blocks if block ~ ~-2 ~1 #minecraft:beacon_base_blocks if block ~1 ~-2 ~-1 #minecraft:beacon_base_blocks if block ~1 ~-2 ~ #minecraft:beacon_base_blocks if block ~1 ~-2 ~1 #minecraft:beacon_base_blocks if data entity @s CustomName run function pocket_dimensions:tick_sacrifice
	execute as @e[type=minecraft:enderman] at @s positioned ~ ~0.2 ~ if block ~ ~-1 ~ minecraft:beacon if block ~-1 ~-2 ~-1 #minecraft:beacon_base_blocks if block ~-1 ~-2 ~ #minecraft:beacon_base_blocks if block ~-1 ~-2 ~1 #minecraft:beacon_base_blocks if block ~ ~-2 ~-1 #minecraft:beacon_base_blocks if block ~ ~-2 ~ #minecraft:beacon_base_blocks if block ~ ~-2 ~1 #minecraft:beacon_base_blocks if block ~1 ~-2 ~-1 #minecraft:beacon_base_blocks if block ~1 ~-2 ~ #minecraft:beacon_base_blocks if block ~1 ~-2 ~1 #minecraft:beacon_base_blocks if data entity @s CustomName run function pocket_dimensions:tick_sacrifice
	scoreboard players set @e[type=minecraft:enderman,tag=!pocDim.sacrifice] pocDim.time 0
	tag @e[type=minecraft:enderman] remove pocDim.sacrifice
}
function unstack_pockets {
	function pocket_dimensions:set_remaining_pockets
	execute unless score #remaining pocDim.dummy matches 0 run function pocket_dimensions:unstack_pocket
}
function unstack_pocket {
	data modify storage pocket_dimensions:storage tempPockets append from storage pocket_dimensions:storage pockets[-1]
	data remove storage pocket_dimensions:storage pockets[-1]
	scoreboard players remove #remaining pocDim.dummy 1
	execute unless score #remaining pocDim.dummy matches 0 run function pocket_dimensions:unstack_pocket
}
function try_to_give {
	execute if score @s pocDim.give > #last pocDim.dummy run tellraw @s {"text":"That pocket ID is not valid.","color":"red"}
	execute unless score @s pocDim.give > #last pocDim.dummy run function pocket_dimensions:give
	scoreboard players set @s pocDim.give 0
}
function tick_sacrifice {
	tag @s add pocDim.sacrifice
	scoreboard players add @s pocDim.time 1
	summon minecraft:area_effect_cloud ~ ~0.3 ~ {UUID:[I;1606271449,1613578856,-2008262932,-260562806]}
	execute as @a[distance=..64] at @s facing entity 5fbdc1d9-602d-4268-884c-56ecf078208a eyes run tp @s ~ ~ ~ ~ ~
	kill 5fbdc1d9-602d-4268-884c-56ecf078208a
	particle minecraft:portal ~ ~2 ~ 0 0 0 1 15
	execute if score @s pocDim.time matches 200.. run function pocket_dimensions:kill_sacrifice
}
function teleport {
	scoreboard players operation @s pocDim.id = #id pocDim.dummy
	execute in pocket_dimensions:dimension run summon minecraft:area_effect_cloud 0 1 1024 {UUID:[I;-1431743830,-212647857,-2098287001,1403551466]}
	execute store result score #z pocDim.dummy run data get storage pocket_dimensions:storage pockets[-1].tier
	scoreboard players operation #z pocDim.dummy *= #offsetScale pocDim.dummy
	scoreboard players operation #x pocDim.dummy = @s pocDim.id
	scoreboard players operation #x pocDim.dummy *= #scale pocDim.dummy
	execute store result entity aaa952aa-f353-404f-82ee-ae6753a87eea Pos[0] double 1 run scoreboard players operation #x pocDim.dummy += #z pocDim.dummy
	execute store result entity aaa952aa-f353-404f-82ee-ae6753a87eea Pos[2] double 1 run scoreboard players add #z pocDim.dummy 1024
	tp @s aaa952aa-f353-404f-82ee-ae6753a87eea
	kill aaa952aa-f353-404f-82ee-ae6753a87eea
}
function set_remaining_pockets {
	scoreboard players operation #remaining pocDim.dummy = #last pocDim.dummy
	scoreboard players operation #remaining pocDim.dummy -= #id pocDim.dummy
}
function restack_pockets {
	function pocket_dimensions:set_remaining_pockets
	execute unless score #remaining pocDim.dummy matches 0 run function pocket_dimensions:restack_pocket
}
function restack_pocket {
	data modify storage pocket_dimensions:storage pockets append from storage pocket_dimensions:storage tempPockets[-1]
	data remove storage pocket_dimensions:storage tempPockets[-1]
	scoreboard players remove #remaining pocDim.dummy 1
	execute unless score #remaining pocDim.dummy matches 0 run function pocket_dimensions:restack_pocket
}
function redrink {
	execute if predicate pocket_dimensions:sneaking run 
	execute unless predicate pocket_dimensions:sneaking run 
}
function kill_sacrifice {
	summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["pocDim.marker"]}
	data modify entity @s DeathTime set value 10s
	kill @s
}
function give {
	summon minecraft:item ~ ~ ~ {Item:{id:"minecraft:potion",Count:1b,tag:{HideFlags:32,display:{Name:'{"text":"Enderman Soul","italic":false,"color":"light_purple"}'},CustomPotionColor:8587492,CustomPotionEffects:[{Id:27b,Amplifier:125b,ShowParticles:0b,ShowIcon:0b}],pocDim:1b}},Tags:["pocDim.potion"]}
	execute store result entity @e[type=minecraft:item,tag=pocDim.potion,limit=1] Item.tag.CustomPotionEffects[0].Duration int 1 run scoreboard players get @s pocDim.give
	data modify entity @e[type=minecraft:item,tag=pocDim.potion,limit=1] Owner set from entity @s UUID
}
function finalize {
	scoreboard players set @s pocDim.tier 1
	execute if block ~-2 ~-3 ~-2 #minecraft:beacon_base_blocks if block ~-2 ~-3 ~-1 #minecraft:beacon_base_blocks if block ~-2 ~-3 ~ #minecraft:beacon_base_blocks if block ~-2 ~-3 ~1 #minecraft:beacon_base_blocks if block ~-2 ~-3 ~2 #minecraft:beacon_base_blocks if block ~-1 ~-3 ~-2 #minecraft:beacon_base_blocks if block ~-1 ~-3 ~-1 #minecraft:beacon_base_blocks if block ~-1 ~-3 ~ #minecraft:beacon_base_blocks if block ~-1 ~-3 ~1 #minecraft:beacon_base_blocks if block ~-1 ~-3 ~2 #minecraft:beacon_base_blocks if block ~ ~-3 ~-2 #minecraft:beacon_base_blocks if block ~ ~-3 ~-1 #minecraft:beacon_base_blocks if block ~ ~-3 ~ #minecraft:beacon_base_blocks if block ~ ~-3 ~1 #minecraft:beacon_base_blocks if block ~ ~-3 ~2 #minecraft:beacon_base_blocks if block ~1 ~-3 ~-2 #minecraft:beacon_base_blocks if block ~1 ~-3 ~-1 #minecraft:beacon_base_blocks if block ~1 ~-3 ~ #minecraft:beacon_base_blocks if block ~1 ~-3 ~1 #minecraft:beacon_base_blocks if block ~1 ~-3 ~2 #minecraft:beacon_base_blocks if block ~2 ~-3 ~-2 #minecraft:beacon_base_blocks if block ~2 ~-3 ~-1 #minecraft:beacon_base_blocks if block ~2 ~-3 ~ #minecraft:beacon_base_blocks if block ~2 ~-3 ~1 #minecraft:beacon_base_blocks if block ~2 ~-3 ~2 #minecraft:beacon_base_blocks run scoreboard players add @s pocDim.tier 1
	execute if score @s pocDim.tier matches 2 if block ~-3 ~-4 ~-3 #minecraft:beacon_base_blocks if block ~-3 ~-4 ~-2 #minecraft:beacon_base_blocks if block ~-3 ~-4 ~-1 #minecraft:beacon_base_blocks if block ~-3 ~-4 ~ #minecraft:beacon_base_blocks if block ~-3 ~-4 ~1 #minecraft:beacon_base_blocks if block ~-3 ~-4 ~2 #minecraft:beacon_base_blocks if block ~-3 ~-4 ~3 #minecraft:beacon_base_blocks if block ~-2 ~-4 ~-3 #minecraft:beacon_base_blocks if block ~-2 ~-4 ~-2 #minecraft:beacon_base_blocks if block ~-2 ~-4 ~-1 #minecraft:beacon_base_blocks if block ~-2 ~-4 ~ #minecraft:beacon_base_blocks if block ~-2 ~-4 ~1 #minecraft:beacon_base_blocks if block ~-2 ~-4 ~2 #minecraft:beacon_base_blocks if block ~-2 ~-4 ~3 #minecraft:beacon_base_blocks if block ~-1 ~-4 ~-3 #minecraft:beacon_base_blocks if block ~-1 ~-4 ~-2 #minecraft:beacon_base_blocks if block ~-1 ~-4 ~-1 #minecraft:beacon_base_blocks if block ~-1 ~-4 ~ #minecraft:beacon_base_blocks if block ~-1 ~-4 ~1 #minecraft:beacon_base_blocks if block ~-1 ~-4 ~2 #minecraft:beacon_base_blocks if block ~-1 ~-4 ~3 #minecraft:beacon_base_blocks if block ~ ~-4 ~-3 #minecraft:beacon_base_blocks if block ~ ~-4 ~-2 #minecraft:beacon_base_blocks if block ~ ~-4 ~-1 #minecraft:beacon_base_blocks if block ~ ~-4 ~ #minecraft:beacon_base_blocks if block ~ ~-4 ~1 #minecraft:beacon_base_blocks if block ~ ~-4 ~2 #minecraft:beacon_base_blocks if block ~ ~-4 ~3 #minecraft:beacon_base_blocks if block ~1 ~-4 ~-3 #minecraft:beacon_base_blocks if block ~1 ~-4 ~-2 #minecraft:beacon_base_blocks if block ~1 ~-4 ~-1 #minecraft:beacon_base_blocks if block ~1 ~-4 ~ #minecraft:beacon_base_blocks if block ~1 ~-4 ~1 #minecraft:beacon_base_blocks if block ~1 ~-4 ~2 #minecraft:beacon_base_blocks if block ~1 ~-4 ~3 #minecraft:beacon_base_blocks if block ~2 ~-4 ~-3 #minecraft:beacon_base_blocks if block ~2 ~-4 ~-2 #minecraft:beacon_base_blocks if block ~2 ~-4 ~-1 #minecraft:beacon_base_blocks if block ~2 ~-4 ~ #minecraft:beacon_base_blocks if block ~2 ~-4 ~1 #minecraft:beacon_base_blocks if block ~2 ~-4 ~2 #minecraft:beacon_base_blocks if block ~2 ~-4 ~3 #minecraft:beacon_base_blocks if block ~3 ~-4 ~-3 #minecraft:beacon_base_blocks if block ~3 ~-4 ~-2 #minecraft:beacon_base_blocks if block ~3 ~-4 ~-1 #minecraft:beacon_base_blocks if block ~3 ~-4 ~ #minecraft:beacon_base_blocks if block ~3 ~-4 ~1 #minecraft:beacon_base_blocks if block ~3 ~-4 ~2 #minecraft:beacon_base_blocks if block ~3 ~-4 ~3 #minecraft:beacon_base_blocks run scoreboard players add @s pocDim.tier 1
	execute if score @s pocDim.tier matches 3 if block ~-4 ~-5 ~-4 #minecraft:beacon_base_blocks if block ~-4 ~-5 ~-3 #minecraft:beacon_base_blocks if block ~-4 ~-5 ~-2 #minecraft:beacon_base_blocks if block ~-4 ~-5 ~-1 #minecraft:beacon_base_blocks if block ~-4 ~-5 ~ #minecraft:beacon_base_blocks if block ~-4 ~-5 ~1 #minecraft:beacon_base_blocks if block ~-4 ~-5 ~2 #minecraft:beacon_base_blocks if block ~-4 ~-5 ~3 #minecraft:beacon_base_blocks if block ~-4 ~-5 ~4 #minecraft:beacon_base_blocks if block ~-3 ~-5 ~-4 #minecraft:beacon_base_blocks if block ~-3 ~-5 ~-3 #minecraft:beacon_base_blocks if block ~-3 ~-5 ~-2 #minecraft:beacon_base_blocks if block ~-3 ~-5 ~-1 #minecraft:beacon_base_blocks if block ~-3 ~-5 ~ #minecraft:beacon_base_blocks if block ~-3 ~-5 ~1 #minecraft:beacon_base_blocks if block ~-3 ~-5 ~2 #minecraft:beacon_base_blocks if block ~-3 ~-5 ~3 #minecraft:beacon_base_blocks if block ~-3 ~-5 ~4 #minecraft:beacon_base_blocks if block ~-2 ~-5 ~-4 #minecraft:beacon_base_blocks if block ~-2 ~-5 ~-3 #minecraft:beacon_base_blocks if block ~-2 ~-5 ~-2 #minecraft:beacon_base_blocks if block ~-2 ~-5 ~-1 #minecraft:beacon_base_blocks if block ~-2 ~-5 ~ #minecraft:beacon_base_blocks if block ~-2 ~-5 ~1 #minecraft:beacon_base_blocks if block ~-2 ~-5 ~2 #minecraft:beacon_base_blocks if block ~-2 ~-5 ~3 #minecraft:beacon_base_blocks if block ~-2 ~-5 ~4 #minecraft:beacon_base_blocks if block ~-1 ~-5 ~-4 #minecraft:beacon_base_blocks if block ~-1 ~-5 ~-3 #minecraft:beacon_base_blocks if block ~-1 ~-5 ~-2 #minecraft:beacon_base_blocks if block ~-1 ~-5 ~-1 #minecraft:beacon_base_blocks if block ~-1 ~-5 ~ #minecraft:beacon_base_blocks if block ~-1 ~-5 ~1 #minecraft:beacon_base_blocks if block ~-1 ~-5 ~2 #minecraft:beacon_base_blocks if block ~-1 ~-5 ~3 #minecraft:beacon_base_blocks if block ~-1 ~-5 ~4 #minecraft:beacon_base_blocks if block ~ ~-5 ~-4 #minecraft:beacon_base_blocks if block ~ ~-5 ~-3 #minecraft:beacon_base_blocks if block ~ ~-5 ~-2 #minecraft:beacon_base_blocks if block ~ ~-5 ~-1 #minecraft:beacon_base_blocks if block ~ ~-5 ~ #minecraft:beacon_base_blocks if block ~ ~-5 ~1 #minecraft:beacon_base_blocks if block ~ ~-5 ~2 #minecraft:beacon_base_blocks if block ~ ~-5 ~3 #minecraft:beacon_base_blocks if block ~ ~-5 ~4 #minecraft:beacon_base_blocks if block ~1 ~-5 ~-4 #minecraft:beacon_base_blocks if block ~1 ~-5 ~-3 #minecraft:beacon_base_blocks if block ~1 ~-5 ~-2 #minecraft:beacon_base_blocks if block ~1 ~-5 ~-1 #minecraft:beacon_base_blocks if block ~1 ~-5 ~ #minecraft:beacon_base_blocks if block ~1 ~-5 ~1 #minecraft:beacon_base_blocks if block ~1 ~-5 ~2 #minecraft:beacon_base_blocks if block ~1 ~-5 ~3 #minecraft:beacon_base_blocks if block ~1 ~-5 ~4 #minecraft:beacon_base_blocks if block ~2 ~-5 ~-4 #minecraft:beacon_base_blocks if block ~2 ~-5 ~-3 #minecraft:beacon_base_blocks if block ~2 ~-5 ~-2 #minecraft:beacon_base_blocks if block ~2 ~-5 ~-1 #minecraft:beacon_base_blocks if block ~2 ~-5 ~ #minecraft:beacon_base_blocks if block ~2 ~-5 ~1 #minecraft:beacon_base_blocks if block ~2 ~-5 ~2 #minecraft:beacon_base_blocks if block ~2 ~-5 ~3 #minecraft:beacon_base_blocks if block ~2 ~-5 ~4 #minecraft:beacon_base_blocks if block ~3 ~-5 ~-4 #minecraft:beacon_base_blocks if block ~3 ~-5 ~-3 #minecraft:beacon_base_blocks if block ~3 ~-5 ~-2 #minecraft:beacon_base_blocks if block ~3 ~-5 ~-1 #minecraft:beacon_base_blocks if block ~3 ~-5 ~ #minecraft:beacon_base_blocks if block ~3 ~-5 ~1 #minecraft:beacon_base_blocks if block ~3 ~-5 ~2 #minecraft:beacon_base_blocks if block ~3 ~-5 ~3 #minecraft:beacon_base_blocks if block ~3 ~-5 ~4 #minecraft:beacon_base_blocks if block ~4 ~-5 ~-4 #minecraft:beacon_base_blocks if block ~4 ~-5 ~-3 #minecraft:beacon_base_blocks if block ~4 ~-5 ~-2 #minecraft:beacon_base_blocks if block ~4 ~-5 ~-1 #minecraft:beacon_base_blocks if block ~4 ~-5 ~ #minecraft:beacon_base_blocks if block ~4 ~-5 ~1 #minecraft:beacon_base_blocks if block ~4 ~-5 ~2 #minecraft:beacon_base_blocks if block ~4 ~-5 ~3 #minecraft:beacon_base_blocks if block ~4 ~-5 ~4 #minecraft:beacon_base_blocks run scoreboard players add @s pocDim.tier 1
}
function drink_potion {
	advancement revoke @s only pocket_dimensions:drink_potion
	execute store result score #id pocDim.dummy run data get entity @s ActiveEffects[{Id:27b,Amplifier:125b,ShowParticles:0b,ShowIcon:0b}].Duration
	function pocket_dimensions:unstack_pockets
	execute if score @s pocDim.id = #id pocDim.dummy run function pocket_dimensions:redrink
	execute unless score @s pocDim.id = #id pocDim.dummy run function pocket_dimensions:teleport
	function pocket_dimensions:restack_pockets
}
function create_tier_4 {
	forceload add ~-1 ~-1 ~32 ~32
	fill ~-1 ~-1 ~-1 ~32 ~32 ~32 minecraft:crying_obsidian outline
	fill ~-1 ~ ~ ~-1 ~31 ~31 minecraft:barrier
	fill ~32 ~ ~ ~32 ~31 ~31 minecraft:barrier
	fill ~ ~-1 ~ ~31 ~-1 ~31 minecraft:barrier
	fill ~ ~32 ~ ~31 ~32 ~31 minecraft:barrier
	fill ~ ~ ~-1 ~31 ~31 ~-1 minecraft:barrier
	fill ~ ~ ~32 ~31 ~31 ~32 minecraft:barrier
	forceload remove ~-1 ~-1 ~32 ~32
}
function create_tier_3 {
	forceload add ~-1 ~-1 ~24 ~24
	fill ~-1 ~-1 ~-1 ~24 ~24 ~24 minecraft:crying_obsidian outline
	fill ~-1 ~ ~ ~-1 ~23 ~23 minecraft:barrier
	fill ~24 ~ ~ ~24 ~23 ~23 minecraft:barrier
	fill ~ ~-1 ~ ~23 ~-1 ~23 minecraft:barrier
	fill ~ ~24 ~ ~23 ~24 ~23 minecraft:barrier
	fill ~ ~ ~-1 ~23 ~23 ~-1 minecraft:barrier
	fill ~ ~ ~24 ~23 ~23 ~24 minecraft:barrier
	forceload remove ~-1 ~-1 ~24 ~24
}
function create_tier_2 {
	forceload add ~-1 ~-1 ~16 ~16
	fill ~-1 ~-1 ~-1 ~16 ~16 ~16 minecraft:crying_obsidian outline
	fill ~-1 ~ ~ ~-1 ~15 ~15 minecraft:barrier
	fill ~16 ~ ~ ~16 ~15 ~15 minecraft:barrier
	fill ~ ~-1 ~ ~15 ~-1 ~15 minecraft:barrier
	fill ~ ~16 ~ ~15 ~16 ~15 minecraft:barrier
	fill ~ ~ ~-1 ~15 ~15 ~-1 minecraft:barrier
	fill ~ ~ ~16 ~15 ~15 ~16 minecraft:barrier
	forceload remove ~-1 ~-1 ~16 ~16
}
function create_tier_1 {
	forceload add ~-1 ~-1 ~8 ~8
	fill ~-1 ~-1 ~-1 ~8 ~8 ~8 minecraft:crying_obsidian outline
	fill ~-1 ~ ~ ~-1 ~7 ~7 minecraft:barrier
	fill ~8 ~ ~ ~8 ~7 ~7 minecraft:barrier
	fill ~ ~-1 ~ ~7 ~-1 ~7 minecraft:barrier
	fill ~ ~8 ~ ~7 ~8 ~7 minecraft:barrier
	fill ~ ~ ~-1 ~7 ~7 ~-1 minecraft:barrier
	fill ~ ~ ~8 ~7 ~7 ~8 minecraft:barrier
	forceload remove ~-1 ~-1 ~8 ~8
}
function create_pocket {
	execute in pocket_dimensions:dimension run summon minecraft:area_effect_cloud 0 1 1024 {UUID:[I;-1431743830,-212647857,-2098287001,1403551466]}
	scoreboard players add #last pocDim.dummy 1
	scoreboard players operation #x pocDim.dummy = #last pocDim.dummy
	execute store result entity aaa952aa-f353-404f-82ee-ae6753a87eea Pos[0] double 1 run scoreboard players operation #x pocDim.dummy *= #scale pocDim.dummy
	execute as aaa952aa-f353-404f-82ee-ae6753a87eea at @s run function pocket_dimensions:create_box
	data modify storage pocket_dimensions:storage pockets append value {}
	data modify storage pocket_dimensions:storage pockets[-1].name set from entity @s CustomName
	execute store result storage pocket_dimensions:storage pockets[-1].tier int 1 run scoreboard players get #tier pocDim.dummy
}
function create_box {
	execute if score #tier pocDim.dummy matches 1 run function pocket_dimensions:create_tier_1
	execute if score #tier pocDim.dummy matches 2 run function pocket_dimensions:create_tier_2
	execute if score #tier pocDim.dummy matches 3 run function pocket_dimensions:create_tier_3
	execute if score #tier pocDim.dummy matches 4 run function pocket_dimensions:create_tier_4
	kill @s
}
function check_sacrifice {
	execute at @s positioned ~ ~0.2 ~ if block ~ ~-1 ~ minecraft:beacon if block ~-1 ~-2 ~-1 #minecraft:beacon_base_blocks if block ~-1 ~-2 ~ #minecraft:beacon_base_blocks if block ~-1 ~-2 ~1 #minecraft:beacon_base_blocks if block ~ ~-2 ~-1 #minecraft:beacon_base_blocks if block ~ ~-2 ~ #minecraft:beacon_base_blocks if block ~ ~-2 ~1 #minecraft:beacon_base_blocks if block ~1 ~-2 ~-1 #minecraft:beacon_base_blocks if block ~1 ~-2 ~ #minecraft:beacon_base_blocks if block ~1 ~-2 ~1 #minecraft:beacon_base_blocks if data entity @s CustomName run function pocket_dimensions:tick_sacrifice
}
