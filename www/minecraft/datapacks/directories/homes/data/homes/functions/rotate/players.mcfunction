execute store result score #remaining homes.dummy run data get storage homes:storage players
data modify storage homes:storage temp set from entity @s UUID
execute store success score #success homes.dummy run data modify storage homes:storage temp set from storage homes:storage players[-1].uuid
execute unless score #remaining homes.dummy matches 0 if score #success homes.dummy matches 1 run function homes:rotate/player
execute if score #remaining homes.dummy matches 0 run function homes:rotate/add_player