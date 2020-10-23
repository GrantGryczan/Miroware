function load {
	scoreboard objectives add capEgg.dummy dummy
}
function uninstall {
	schedule clear capture_eggs:tick
	scoreboard objectives remove capEgg.dummy
	data remove storage capture_eggs:storage temp
}
clock 1t {
	name tick
	execute as @e[type=minecraft:egg] at @s if entity @e[type=#capture_eggs:capturable,distance=..5] run {
		name tick_egg
		tag @s add capEgg.egg
		data modify storage capture_eggs:storage temp set from entity @s {}
		execute store result score #posX capEgg.dummy run data get storage capture_eggs:storage temp.Pos[0] 100
		execute store result score #posY capEgg.dummy run data get storage capture_eggs:storage temp.Pos[1] 100
		execute store result score #posZ capEgg.dummy run data get storage capture_eggs:storage temp.Pos[2] 100
		execute store result score #motionX capEgg.dummy run data get storage capture_eggs:storage temp.Motion[0] 100
		execute store result score #motionY capEgg.dummy run data get storage capture_eggs:storage temp.Motion[1] 100
		execute store result score #motionZ capEgg.dummy run data get storage capture_eggs:storage temp.Motion[2] 100
		execute store result storage capture_eggs:storage temp.Pos[0] double 0.01 run scoreboard players operation #posX capEgg.dummy -= #motionX capEgg.dummy
		execute store result storage capture_eggs:storage temp.Pos[1] double 0.01 run scoreboard players operation #posY capEgg.dummy -= #motionY capEgg.dummy
		execute store result storage capture_eggs:storage temp.Pos[2] double 0.01 run scoreboard players operation #posZ capEgg.dummy -= #motionZ capEgg.dummy
		summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["capEgg.marker"]}
		data modify entity @e[type=minecraft:area_effect_cloud,tag=capEgg.marker,distance=..8,limit=1] Pos set from storage capture_eggs:storage temp.Pos
		scoreboard players set #steps capEgg.dummy 20
		execute at @e[type=minecraft:area_effect_cloud,tag=capEgg.marker,distance=..8,limit=1] facing entity @s feet positioned as @s run {
			name check
			execute positioned ~-0.5 ~-0.5 ~-0.5 as @e[type=#capture_eggs:capturable,dx=0,dy=0,dz=0,sort=nearest,limit=1] at @s run {
				name capture
				LOOP (config.data.spawnEggs, id) {
					execute if entity @s[type=<% id %>] run summon minecraft:item ~ ~ ~ {Tags:["capEgg.drop"],Item:{id:"<% id %>_spawn_egg",Count:1b}}
				}
				LOOP (config.data.notSpawnEggs, entity) {
					execute if entity @s[type=<% entity.id %>] run summon minecraft:item ~ ~ ~ {Tags:["capEgg.drop"],Item:{id:"<% entity.spawnEgg %>",Count:1b,tag:{capEggData:1b,display:{Name:'["",{"text":"<% entity.name %> Spawn Egg","italic":false}]'},EntityTag:{id:"<% entity.id %>",CustomName:"[]"}}}}
				}
				data modify storage capture_eggs:storage temp set from entity @s {}
				data remove storage capture_eggs:storage temp.UUID
				data remove storage capture_eggs:storage temp.Pos
				data remove storage capture_eggs:storage temp.Rotation
				execute as @e[type=minecraft:item,tag=capEgg.drop,distance=..0.01] run {
					name set_drop
					data modify entity @s Item.tag.display.Name set from storage capture_eggs:storage temp.CustomName
					data modify entity @s Item.tag.EntityTag merge from storage capture_eggs:storage temp
				}
				tp @s ~ -512 ~
				data merge entity @s {DeathTime:19s,Health:0.0f}
				kill @e[type=minecraft:egg,tag=capEgg.egg,distance=..8]
				scoreboard players set #steps capEgg.dummy 0
				playsound minecraft:entity.chicken.egg player @a
				particle minecraft:poof ~ ~0.25 ~ 0.5 0.5 0.5 0.075 50
			}
			scoreboard players remove #steps capEgg.dummy 1
			execute unless score #steps capEgg.dummy matches 0 positioned ^ ^ ^0.1 run function $block
		}
		kill @e[type=minecraft:area_effect_cloud,tag=capEgg.marker,distance=..8,limit=1]
		tag @s remove capEgg.egg
	}
}
