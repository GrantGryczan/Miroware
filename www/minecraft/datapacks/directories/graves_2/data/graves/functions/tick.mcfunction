schedule function graves:tick 1t
execute as @a[scores={graves.deaths=1..}] run function graves:die
execute as @e[type=minecraft:armor_stand,tag=graves.hitbox] at @s if entity @a[gamemode=!spectator,distance=..2] align xz run function graves:show_name
scoreboard players enable @a grave
execute as @a[scores={grave=1}] run function graves:trigger_grave