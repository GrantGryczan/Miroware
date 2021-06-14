scoreboard players set #id1 homes.dummy 0
scoreboard players set #id2 homes.dummy 0
execute unless score #remaining homes.dummy matches 1 run function homes:bubble
execute store result score #id homes.dummy run data get storage homes:storage temp[0].id
execute if data storage homes:storage temp[0].name run tag @s add homes.nameSet
execute if score #reducedDebugInfo homes.dummy matches 1 run function homes:display_home_with_reduced_info
execute unless score #reducedDebugInfo homes.dummy matches 1 run function homes:display_home_with_all_info
tag @s remove homes.nameSet
tag @e[type=minecraft:marker,tag=homes.target,limit=1] remove homes.target
data remove storage homes:storage temp[0]
execute store result score #remaining homes.dummy run scoreboard players remove #homes homes.dummy 1
data modify storage homes:storage temp set from storage homes:storage temp2
data modify storage homes:storage temp2 set value []
execute unless score #homes homes.dummy matches 0 run function homes:list_home