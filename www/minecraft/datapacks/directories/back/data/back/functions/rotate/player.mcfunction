data modify storage back:storage players prepend from storage back:storage players[-1]
data remove storage back:storage players[-1]
scoreboard players remove #remaining back.dummy 1
data modify storage back:storage temp set from entity @s UUID
execute store success score #success back.dummy run data modify storage back:storage temp set from storage back:storage players[-1].uuid
execute unless score #remaining back.dummy matches 0 if score #success back.dummy matches 1 run function back:rotate/player