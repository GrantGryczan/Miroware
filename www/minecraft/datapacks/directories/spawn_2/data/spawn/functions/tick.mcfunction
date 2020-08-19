schedule function spawn:tick 1t
scoreboard players enable @a spawn
execute as @a[scores={spawn=1..}] run function spawn:trigger_spawn
execute as @a[scores={spawn.delay=0..}] align xz positioned ~0.5 ~ ~0.5 run function spawn:try_to_try_to_go_to_spawn