execute store result score #remaining back.dummy run data get storage back:storage players
data modify storage back:storage temp set from entity @s UUID
execute store success score #success back.dummy run data modify storage back:storage temp set from storage back:storage players[-1].uuid
execute unless score #remaining back.dummy matches 0 if score #success back.dummy matches 1 run function back:rotate/player
execute if score #remaining back.dummy matches 0 run function back:rotate/add_player