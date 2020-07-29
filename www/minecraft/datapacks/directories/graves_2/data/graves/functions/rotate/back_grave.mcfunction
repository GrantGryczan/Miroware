data modify storage graves:storage players[-1].graves prepend from storage graves:storage players[-1].graves[-1]
data remove storage graves:storage players[-1].graves[-1]
scoreboard players remove #remaining graves.dummy 1
execute unless score #remaining graves.dummy matches 0 run function graves:rotate/back_grave