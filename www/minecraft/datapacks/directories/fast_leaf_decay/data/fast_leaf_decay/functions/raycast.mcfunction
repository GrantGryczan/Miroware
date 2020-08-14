scoreboard players remove #steps leafDec.dummy 1
execute align xyz run function fast_leaf_decay:try_to_iterate
execute unless score #steps leafDec.dummy matches 0 positioned ^ ^ ^0.1 run function fast_leaf_decay:raycast