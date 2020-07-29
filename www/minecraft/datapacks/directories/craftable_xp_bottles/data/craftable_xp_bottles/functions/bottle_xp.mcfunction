clear @s minecraft:glass_bottle 1
give @s minecraft:experience_bottle
xp add @s -12 points
playsound minecraft:item.bottle.fill_dragonbreath player @a ~ ~ ~ 1 1.25
scoreboard players set #steps craXPBot.dummy 50
execute anchored eyes positioned ^ ^ ^ run function craftable_xp_bottles:raycast
tag @s remove craXPBot.continue