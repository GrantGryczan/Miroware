scoreboard players remove #steps leafDec.dummy 1
execute align xyz unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.marker,distance=..0.1] run function fast_leaf_decay:try_to_iterate
execute unless score #steps leafDec.dummy matches 0 positioned ^ ^ ^0.1 run function fast_leaf_decay:raycast