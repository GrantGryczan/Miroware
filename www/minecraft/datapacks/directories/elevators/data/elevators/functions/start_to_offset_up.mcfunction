execute if block ~ ~-1 ~ minecraft:white_wool run scoreboard players set #color elevs.dummy 0
execute if block ~ ~-1 ~ minecraft:orange_wool run scoreboard players set #color elevs.dummy 1
execute if block ~ ~-1 ~ minecraft:magenta_wool run scoreboard players set #color elevs.dummy 2
execute if block ~ ~-1 ~ minecraft:light_blue_wool run scoreboard players set #color elevs.dummy 3
execute if block ~ ~-1 ~ minecraft:yellow_wool run scoreboard players set #color elevs.dummy 4
execute if block ~ ~-1 ~ minecraft:lime_wool run scoreboard players set #color elevs.dummy 5
execute if block ~ ~-1 ~ minecraft:pink_wool run scoreboard players set #color elevs.dummy 6
execute if block ~ ~-1 ~ minecraft:gray_wool run scoreboard players set #color elevs.dummy 7
execute if block ~ ~-1 ~ minecraft:light_gray_wool run scoreboard players set #color elevs.dummy 8
execute if block ~ ~-1 ~ minecraft:cyan_wool run scoreboard players set #color elevs.dummy 9
execute if block ~ ~-1 ~ minecraft:purple_wool run scoreboard players set #color elevs.dummy 10
execute if block ~ ~-1 ~ minecraft:blue_wool run scoreboard players set #color elevs.dummy 11
execute if block ~ ~-1 ~ minecraft:brown_wool run scoreboard players set #color elevs.dummy 12
execute if block ~ ~-1 ~ minecraft:green_wool run scoreboard players set #color elevs.dummy 13
execute if block ~ ~-1 ~ minecraft:red_wool run scoreboard players set #color elevs.dummy 14
execute if block ~ ~-1 ~ minecraft:black_wool run scoreboard players set #color elevs.dummy 15
tag @s add elevs.continue
function elevators:offset_up
tag @s remove elevs.continue