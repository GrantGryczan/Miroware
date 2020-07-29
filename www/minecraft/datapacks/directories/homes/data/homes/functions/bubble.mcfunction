execute if score #id1 homes.dummy matches 0 store result score #id1 homes.dummy run data get storage homes:storage temp[-1].id
execute if score #id2 homes.dummy matches 0 store result score #id2 homes.dummy run data get storage homes:storage temp[-2].id
execute if score #id1 homes.dummy > #id2 homes.dummy run function homes:bubble_1
execute if score #id2 homes.dummy > #id1 homes.dummy run function homes:bubble_2
scoreboard players remove #remaining homes.dummy 1
execute unless score #remaining homes.dummy matches 1 run function homes:bubble