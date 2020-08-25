scoreboard players set #continue leafDec.dummy 1
execute as @e[type=minecraft:area_effect_cloud,tag=leafDec.marker,distance=..0.01] run function fast_leaf_decay:reset_marker
execute if score #continue leafDec.dummy matches 1 run summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["leafDec.marker","leafDec.new"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
execute if block ~ ~ ~ #minecraft:leaves[distance=1] run function fast_leaf_decay:check_leaves/0
execute if block ~ ~ ~ #minecraft:leaves[distance=2] run function fast_leaf_decay:check_leaves/1
execute if block ~ ~ ~ #minecraft:leaves[distance=3] run function fast_leaf_decay:check_leaves/2
execute if block ~ ~ ~ #minecraft:leaves[distance=4] run function fast_leaf_decay:check_leaves/3
execute if block ~ ~ ~ #minecraft:leaves[distance=5] run function fast_leaf_decay:check_leaves/4
execute if predicate fast_leaf_decay:leaves/4 run function fast_leaf_decay:check_leaves/5