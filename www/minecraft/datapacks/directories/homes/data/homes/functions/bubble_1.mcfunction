data modify storage homes:storage temp2 append from storage homes:storage temp[-1]
data remove storage homes:storage temp[-1]
scoreboard players operation #id1 homes.dummy = #id2 homes.dummy
scoreboard players set #id2 homes.dummy 0