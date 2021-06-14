data modify storage back:storage temp set from storage back:storage players[-1].back.dim
execute store success score #success back.dummy run data modify storage back:storage temp set from entity @s data.Dimension
execute if score #success back.dummy matches 0 at @s run summon minecraft:marker ~ ~ ~ {Tags:["back.destination"]}