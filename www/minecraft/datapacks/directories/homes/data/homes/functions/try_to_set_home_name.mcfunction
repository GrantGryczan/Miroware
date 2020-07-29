data modify storage homes:storage temp set from storage homes:storage players[-1].homes[-1].name
execute store success score #success homes.dummy run data modify storage homes:storage temp set from entity @s SelectedItem.tag.display.Name
execute if score #success homes.dummy matches 1 run function homes:set_home_name
execute unless score #success homes.dummy matches 1 run tellraw @s {"text":"Your home is already named that.","color":"red"}