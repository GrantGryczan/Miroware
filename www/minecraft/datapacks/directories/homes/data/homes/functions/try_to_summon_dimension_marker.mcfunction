execute store result score #success homes.dummy run forceload add ~ ~
execute if score #success homes.dummy matches 1 run summon minecraft:marker ~ ~ ~ {Tags:["homes.dimension"]}
execute if entity @e[type=minecraft:marker,tag=homes.dimension,distance=0..] run function homes:initialize_dimension_marker