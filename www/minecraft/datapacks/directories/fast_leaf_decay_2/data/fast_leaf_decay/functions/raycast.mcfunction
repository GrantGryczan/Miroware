scoreboard players remove #steps leafDec.dummy 1
function fast_leaf_decay:check
execute unless score #steps leafDec.dummy matches 0 positioned ^ ^ ^0.1 run function fast_leaf_decay:raycast