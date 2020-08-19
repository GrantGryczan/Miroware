schedule function confetti_creepers:tick 1t
execute as @e[type=minecraft:creeper,tag=!conCre.ready] at @s run function confetti_creepers:initiate_creeper
effect give @e[type=minecraft:creeper,tag=conCre.lucky] minecraft:luck 1 10 true
execute as @e[type=minecraft:area_effect_cloud,tag=!conCre.done] run function confetti_creepers:check_effect_cloud
scoreboard players enable @a conCre
execute as @a[scores={conCre=1}] run function confetti_creepers:info
scoreboard players set @a conCre 0