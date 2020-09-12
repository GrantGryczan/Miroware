schedule function confetti_creepers:tick 1t
execute as @e[type=minecraft:creeper,tag=!cftCreep.done] at @s run function confetti_creepers:initiate_creeper
execute as @e[type=minecraft:area_effect_cloud,tag=!cftCreep.done] run function confetti_creepers:check_effect_cloud