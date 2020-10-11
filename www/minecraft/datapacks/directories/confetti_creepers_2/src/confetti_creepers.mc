function load {
	scoreboard objectives add cftCreep.config dummy "Confetti Creepers Config"
	scoreboard objectives add cftCreep trigger "Confetti Creepers"
	scoreboard players set #total cftCreep.config 100
	execute unless score #chance cftCreep.config matches 0..100 run scoreboard players set #chance cftCreep.config 100
}
function uninstall {
	schedule clear confetti_creepers:tick
	schedule clear confetti_creepers:check_trigger
	schedule clear confetti_creepers:give_effects
	scoreboard objectives remove cftCreep
	scoreboard objectives remove cftCreep.config
}
clock 1t {
	name tick
	execute as @e[type=minecraft:creeper,tag=!cftCreep.done] at @s run {
		name initiate_creeper
		tag @s add cftCreep.done
		execute store result score #value cftCreep.config run data get entity @s UUID[0]
		scoreboard players operation #value cftCreep.config %= #total cftCreep.config
		execute if score #value cftCreep.config < #chance cftCreep.config run {
			name set_confetti
			data modify entity @s ExplosionRadius set value 0b
			effect give @s minecraft:luck 1000000 10 true
			tag @s add cftCreep.confetti
		}
	}
	execute as @e[type=minecraft:area_effect_cloud,tag=!cftCreep.done] run {
		name check_effect_cloud
		tag @s add cftCreep.done
		execute at @s[nbt={Effects:[{Id:26b,Amplifier:10b,ShowParticles:0b}]}] run {
			name create_confetti
			summon minecraft:firework_rocket ~ ~ ~ {LifeTime:0,FireworksItem:{id:"minecraft:creeper_head",Count:1b,tag:{Fireworks:{Explosions:[{Flicker:0b,Trail:0b,Type:4b,Colors:[I;11743532,15435844,14602026,4312372,6719955,8073150,14188952]}]}}}}
			data remove entity @s Effects[{Id:26b,Amplifier:10b,ShowParticles:0b}]
			execute unless data entity @s Effects[0] run kill @s
		}
	}
}
clock 10t {
	name check_trigger
	scoreboard players enable @a cftCreep
	execute as @a[scores={cftCreep=1}] run {
		name trigger
		tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
		tellraw @s ["                        Confetti Creepers",{"text":" / ","color":"gray"},"Info                        "]
		tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
		tellraw @s ["",{"text":">> ","color":"gray"},"There is a ",{"score":{"name":"#chance","objective":"cftCreep.config"}},"% chance each creeper will explode into confetti and do no damage to blocks."]
		tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
		scoreboard players set @s cftCreep 0
	}
}
clock 1000000t {
	name give_effects
	effect give @e[type=minecraft:creeper,tag=cftCreep.confetti] minecraft:luck 1000000 10 true
}
function config {
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	tellraw @s ["                 Confetti Creepers",{"text":" / ","color":"gray"},"Global Settings                 "]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #chance cftCreep.config "},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enter the percent chance each creeper will be a confetti creeper.\nSet this to a low but not-too-low value like 20 for pleasant surprises. :)","color":"gray"},{"text":"\nAccepts: whole numbers 0-100\nDefault: 100","color":"dark_gray"}]}}," Confetti Chance ",{"text":"(Current: ","color":"gray"},{"score":{"name":"#chance","objective":"cftCreep.config"},"color":"gray"},{"text":"%)","color":"gray"}]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	execute store result score #sendCommandFeedback cftCreep.config run gamerule sendCommandFeedback
	execute if score #sendCommandFeedback cftCreep.config matches 1 run {
		name hide_command_feedback
		gamerule sendCommandFeedback false
		schedule 1t replace {
			name restore_command_feedback
			gamerule sendCommandFeedback true
		}
	}
}
