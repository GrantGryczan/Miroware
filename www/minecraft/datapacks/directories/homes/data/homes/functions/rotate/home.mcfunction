data modify storage homes:storage players[-1].homes prepend from storage homes:storage players[-1].homes[-1]
data remove storage homes:storage players[-1].homes[-1]
scoreboard players remove #remaining homes.dummy 1
execute store result score #id homes.dummy run data get storage homes:storage players[-1].homes[-1].id
execute unless score #remaining homes.dummy matches 0 unless score #id homes.dummy = #home homes.dummy run function homes:rotate/home