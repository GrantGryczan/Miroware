data modify storage homes:storage players prepend from storage homes:storage players[-1]
data remove storage homes:storage players[-1]
scoreboard players remove #remaining homes.dummy 1
data modify storage homes:storage temp set from entity @s UUID
execute store success score #success homes.dummy run data modify storage homes:storage temp set from storage homes:storage players[-1].uuid
execute unless score #remaining homes.dummy matches 0 if score #success homes.dummy matches 1 run function homes:rotate/player