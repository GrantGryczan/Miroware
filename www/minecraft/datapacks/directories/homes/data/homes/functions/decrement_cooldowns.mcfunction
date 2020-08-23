schedule function homes:decrement_cooldowns 1s
execute as @a[scores={homes.cooldown=1..}] run function homes:decrement_cooldown