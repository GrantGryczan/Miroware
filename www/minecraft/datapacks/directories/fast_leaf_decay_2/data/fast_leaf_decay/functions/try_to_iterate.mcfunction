tag @s remove leafDec.new
execute if block ~ ~ ~ #minecraft:leaves[distance=1] run function fast_leaf_decay:check_leaves/0
execute if block ~ ~ ~ #minecraft:leaves[distance=2] run function fast_leaf_decay:check_leaves/1
execute if block ~ ~ ~ #minecraft:leaves[distance=3] run function fast_leaf_decay:check_leaves/2
execute if block ~ ~ ~ #minecraft:leaves[distance=4] run function fast_leaf_decay:check_leaves/3
execute if block ~ ~ ~ #minecraft:leaves[distance=5] run function fast_leaf_decay:check_leaves/4
execute if predicate fast_leaf_decay:leaves/4 run function fast_leaf_decay:check_leaves/5