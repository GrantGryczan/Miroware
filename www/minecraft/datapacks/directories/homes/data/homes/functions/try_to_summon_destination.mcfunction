data modify storage homes:storage temp set from storage homes:storage players[-1].homes[-1].dim
execute store success score #success homes.dummy run data modify storage homes:storage temp set from entity @s data.Dimension
execute if score #success homes.dummy matches 0 at @s run summon minecraft:marker ~ ~ ~ {Tags:["homes.destination"]}