schedule function spawn:decrement_cooldowns 1s
execute as @a[scores={spawn.cooldown=1..}] run function spawn:decrement_cooldown