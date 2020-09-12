schedule function confetti_creepers:check_trigger 10t
scoreboard players enable @a cftCreep
execute as @a[scores={cftCreep=1}] run function confetti_creepers:trigger