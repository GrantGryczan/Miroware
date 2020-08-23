schedule function durability_ping:schedule 1s
scoreboard players enable @a duraPing
execute as @a[scores={duraPing.weapon=1..}] run function durability_ping:decrement_weapon_cooldown
execute as @a[scores={duraPing.armor=1..}] run function durability_ping:decrement_armor_cooldown