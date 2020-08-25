function load {
	scoreboard objectives add spawn trigger "Spawn"
	scoreboard objectives add spawn.config dummy "Spawn Config"
	scoreboard objectives add spawn.dummy dummy
	scoreboard objectives add spawn.delay dummy
	scoreboard objectives add spawn.cooldown dummy
	scoreboard objectives add spawn.x dummy
	scoreboard objectives add spawn.y dummy
	scoreboard objectives add spawn.z dummy
	execute unless score #delay spawn.config matches 0.. run scoreboard players set #delay spawn.config 0
	execute unless score #cooldown spawn.config matches 0.. run scoreboard players set #cooldown spawn.config 0
}
function uninstall {
	schedule clear spawn:tick
	schedule clear spawn:decrement_cooldowns
	scoreboard objectives remove spawn
	scoreboard objectives remove spawn.config
	scoreboard objectives remove spawn.dummy
	scoreboard objectives remove spawn.delay
	scoreboard objectives remove spawn.cooldown
	scoreboard objectives remove spawn.x
	scoreboard objectives remove spawn.y
	scoreboard objectives remove spawn.z
}
clock 1t {
	name tick
	scoreboard players enable @a spawn
	execute as @a[scores={spawn=1..}] run {
		name trigger_spawn
		execute if score @s spawn.cooldown matches 1.. run tellraw @s [{"text":"Your Spawn cooldown will end in ","color":"red"},{"score":{"name":"@s","objective":"spawn.cooldown"},"color":"red"},{"text":" seconds.","color":"red"}]
		execute unless score @s spawn.cooldown matches 1.. run {
			name start_to_go_to_spawn
			tellraw @s {"text":"Teleporting to world spawn...","color":"COLOR_1"}
			scoreboard players operation @s spawn.delay = #delay spawn.config
			execute store result score @s spawn.x run data get entity @s Pos[0] 10
			execute store result score @s spawn.y run data get entity @s Pos[1] 10
			execute store result score @s spawn.z run data get entity @s Pos[2] 10
		}
		scoreboard players set @s spawn 0
	}
	execute as @a[scores={spawn.delay=0..}] align xz positioned ~0.5 ~ ~0.5 run {
		name try_to_try_to_go_to_spawn
		execute if score @s spawn.delay matches 0 run {
			name try_to_go_to_spawn
			scoreboard players set #success spawn.dummy 0
			execute store result score #value spawn.dummy run data get entity @s Pos[1] 10
			execute if score #value spawn.dummy = @s spawn.y run {
				name check_x
				execute store result score #value spawn.dummy run data get entity @s Pos[0] 10
				execute if score #value spawn.dummy = @s spawn.x run {
					name check_z
					execute store result score #value spawn.dummy run data get entity @s Pos[2] 10
					execute store success score #success spawn.dummy if score #value spawn.dummy = @s spawn.z
				}
			}
			scoreboard players reset @s spawn.x
			scoreboard players reset @s spawn.y
			scoreboard players reset @s spawn.z
			execute if score #success spawn.dummy matches 0 run tellraw @s [{"text":"You must stand still to teleport.","color":"red"}]
			execute unless score #success spawn.dummy matches 0 run {
				name go_to_spawn
				execute unless score #cooldown spawn.config matches 0 run scoreboard players operation @s spawn.cooldown = #cooldown spawn.config
				execute at @s run function back:set_back
				summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["spawn.destination"]}
				block {
					name offset_up
					tp @s ~ ~ ~
					execute unless block ~ ~ ~ #spawn:passable if entity @s[y=0,dy=255] positioned ~ ~1 ~ run function $block
				}
				execute if block ~ ~ ~ #spawn:passable run {
					name offset_down
					tp @s ~ ~ ~
					execute positioned ~ ~-1 ~ if block ~ ~ ~ #spawn:passable run function $block
					execute if entity @s[y=0,dy=0] at @e[type=minecraft:area_effect_cloud,tag=spawn.destination] run tp @s ~ ~ ~
				}
				kill @e[type=minecraft:area_effect_cloud,tag=spawn.destination]
			}
			scoreboard players reset @s spawn.delay
		}
		execute unless score @s spawn.delay matches 0 run scoreboard players remove @s spawn.delay 1
	}
}
clock 1s {
	name decrement_cooldowns
	execute as @a[scores={spawn.cooldown=1..}] run {
		name decrement_cooldown
		scoreboard players remove @s spawn.cooldown 1
		scoreboard players reset @s[scores={spawn.cooldown=0}] spawn.cooldown
	}
}
function config {
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	tellraw @s ["                         Spawn",{"text":" / ","color":"gray"},"Global Settings                         "]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #delay spawn.config "},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enter the number of ticks required to stand still after running the spawn command.\n1 second = 20 ticks","color":"gray"},{"text":"\nAccepts: whole numbers 0+\nDefault: 0","color":"dark_gray"}]}}," Delay ",{"text":"(Current: ","color":"gray"},{"score":{"name":"#delay","objective":"spawn.config"},"color":"gray"},{"text":")","color":"gray"}]
	tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #cooldown spawn.config "},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enter the number of seconds required to wait between uses of the spawn command.","color":"gray"},{"text":"\nAccepts: whole numbers 0+\nDefault: 0","color":"dark_gray"}]}}," Cooldown ",{"text":"(Current: ","color":"gray"},{"score":{"name":"#cooldown","objective":"spawn.config"},"color":"gray"},{"text":")","color":"gray"}]
	tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
	execute store result score #sendCommandFeedback spawn.config run gamerule sendCommandFeedback
	execute if score #sendCommandFeedback spawn.config matches 1 run {
		name hide_command_feedback
		gamerule sendCommandFeedback false
		schedule 1t replace {
			name restore_command_feedback
			gamerule sendCommandFeedback true
		}
	}
}
