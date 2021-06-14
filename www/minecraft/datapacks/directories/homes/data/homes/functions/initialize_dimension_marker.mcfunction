execute store result score #id homes.dummy run data get storage homes:storage lastDimension
execute store result entity @e[type=minecraft:marker,tag=,limit=1] data.id int 1 run scoreboard players add #id homes.dummy 1
execute store result storage homes:storage lastDimension int 1 run scoreboard players get #id homes.dummy
data modify entity @e[type=minecraft:marker,tag=,limit=1] data.name set from entity @s Dimension