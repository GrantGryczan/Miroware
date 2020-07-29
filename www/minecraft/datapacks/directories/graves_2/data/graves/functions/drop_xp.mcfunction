summon minecraft:experience_orb ~ ~0.2 ~ {Tags:["graves.xp"]}
execute store result entity @e[type=minecraft:experience_orb,tag=graves.xp,limit=1] Value short 1 run scoreboard players get #xp graves.dummy
tag @e[type=minecraft:experience_orb] remove graves.xp