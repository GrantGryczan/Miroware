function graves:rotate/players
execute store success score #success graves.dummy run data get storage graves:storage players[-1].graves[-1]
execute if score #success graves.dummy matches 1 run function graves:display_grave_location
execute unless score #success graves.dummy matches 1 run tellraw @s {"text":"You do not have a last grave.","color":"red"}