execute as @e[type=minecraft:item,tag=!homes.notDimensionMarker] unless data entity @s Item.tag.homesData.markDimension run tag @s add homes.notDimensionMarker
scoreboard players set #marked homes.dummy 0
execute as @e[type=minecraft:item,tag=!homes.notDimensionMarker,limit=1] at @s run function homes:mark_dimension
execute if score #marked homes.dummy matches 0 run schedule function homes:try_to_mark_dimension 1t append