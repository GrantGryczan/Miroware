function load {
	scoreboard objectives add conCre.config dummy "Confetti Creepers Config"
	scoreboard objectives add conCre trigger "Confetti Creepers"
	scoreboard objectives add conCre.dummy dummy
	scoreboard players set #total conCre.config 100
	execute unless score #chance conCre.config matches 0..100 run scoreboard players set #chance conCre.config 100
}
function uninstall {
	schedule clear confetti_creepers:tick
	scoreboard objectives remove conCre
	scoreboard objectives remove conCre.dummy
	scoreboard objectives remove conCre.config
}
clock 1t {
	name tick
	execute as @e[type=minecraft:creeper,tag=!conCre.ready] at @s run {
		name initiate_creeper
		execute store result score @s conCre.dummy run data get entity @s UUID[0]
		scoreboard players operation @s conCre.dummy %= #total conCre.config
		execute if score @s conCre.dummy < #chance conCre.config run tag @s add conCre.lucky
		data modify entity @s[tag=conCre.lucky] ExplosionRadius set value 0b
		tag @s add conCre.ready
	}
	effect give @e[type=minecraft:creeper,tag=conCre.lucky] minecraft:luck 1 10 true
	execute as @e[type=minecraft:area_effect_cloud,tag=!conCre.done] run {
		name check_effect_cloud
		tag @s add conCre.done
		execute at @s[nbt={Effects:[{ShowParticles:0b,Duration:20,Id:26b,Amplifier:10b}]}] run {
			name confetti
			summon minecraft:firework_rocket ~ ~ ~ {LifeTime:0,FireworksItem:{id:"minecraft:creeper_head",Count:1b,tag:{Fireworks:{Explosions:[{Flicker:0b,Trail:0b,Type:4b,Colors:[I;11743532,15435844,14602026,4312372,6719955,8073150,14188952]}]}}}}
			data remove entity @s Effects[{ShowParticles:0b,Duration:20,Id:26b,Amplifier:10b}]
			execute unless data entity @s Effects[0] run kill @s
		}
	}
	scoreboard players enable @a conCre
	execute as @a[scores={conCre=1}] run {
		name info
		tellraw @s [{"text":"There is a ","color":"COLOR_1"},{"score":{"name":"#chance","objective":"conCre.config"},"color":"COLOR_2"},{"text":"%","color":"COLOR_2"},{"text":" chance each creeper will explode into confetti and do no damage to blocks.","color":"COLOR_1"}]
	}
	scoreboard players set @a conCre 0
}
function config {
	function confetti_creepers:info
	tellraw @s [{"text":"Enter","color":"COLOR_3"},{"text":" or ","color":"COLOR_1"},{"text":"click","color":"COLOR_3"},{"text":" on ","color":"COLOR_1"},{"text":"/scoreboard players set #chance conCre.config <percentage>","color":"COLOR_2","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #chance conCre.config "},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to write ","color":"COLOR_1"},{"text":"/scoreboard players set #chance conCre.config","color":"COLOR_2"},{"text":".\nEnter the number 0 to 100 after clicking.","color":"COLOR_1"}]}},{"text":" to set the percent chance each creeper will be a confetti creeper. The default is ","color":"COLOR_1"},{"text":"100","color":"COLOR_2","clickEvent":{"action":"run_command","value":"/scoreboard players set #chance conCre.config 100"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/scoreboard players set #chance conCre.config 100","color":"COLOR_2"},{"text":".","color":"COLOR_1"}]}},{"text":". If this is not 100, the recommended value is ","color":"COLOR_1"},{"text":"20","color":"COLOR_2","clickEvent":{"action":"run_command","value":"/scoreboard players set #chance conCre.config 20"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/scoreboard players set #chance conCre.config 20","color":"COLOR_2"},{"text":".","color":"COLOR_1"}]}},{"text":".","color":"COLOR_1"}]
}
