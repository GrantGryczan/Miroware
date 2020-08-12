execute store success score #success back.dummy if data storage back:storage players[-1].back
execute if score #success back.dummy matches 0 run tellraw @s [{"text":"You have nowhere to go back to.","color":"red"}]
execute unless score #success back.dummy matches 0 run function back:go_back