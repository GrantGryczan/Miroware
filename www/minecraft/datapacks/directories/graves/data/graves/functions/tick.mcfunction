execute as @a[scores={graves.deaths=1..}] run function graves:death
execute as @e[type=minecraft:armor_stand,tag=graves.model] at @s run function graves:tick_model
execute as @a[predicate=graves:interacted_with_grave] at @s run function graves:activate_grave
execute as @e[type=minecraft:armor_stand,tag=graves.hitbox] at @s if entity @a[gamemode=!spectator,distance=..2] align xz run function graves:show_name
scoreboard players enable @a grave
execute as @a[scores={grave=1}] run function graves:trigger_grave
scoreboard players reset * graves.sneak
schedule function graves:tick 1t