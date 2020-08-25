execute if block ~ ~ ~ #minecraft:leaves[distance=7] run function fast_leaf_decay:tick_distant_marker
execute if score #continue leafDec.dummy matches 1 run kill @s[scores={leafDec.dummy=60..}]