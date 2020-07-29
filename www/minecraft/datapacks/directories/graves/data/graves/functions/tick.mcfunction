execute as @a[gamemode=!spectator,scores={graves.deaths=1..}] at @s run function graves:death
scoreboard players set @a graves.deaths 0
execute as @e[type=minecraft:armor_stand,tag=graves.model] at @s run function graves:tick_model
execute as @a[nbt={SelectedItem:{tag:{gravesData:{}}}}] at @s run function graves:activate_grave
execute as @e[type=minecraft:armor_stand,tag=graves.hitbox] at @s if entity @a[gamemode=!spectator,distance=..2] align xz run function graves:show_name
scoreboard players enable @a grave
execute as @a[scores={grave=1}] run function graves:trigger_grave
scoreboard players set @a graves.sneak 0
schedule function graves:tick 1t