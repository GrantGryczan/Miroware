schedule function tpa:decrement_cooldowns 1s
execute as @a[scores={tpa.cooldown=1..}] run function tpa:decrement_cooldown