scoreboard players set #continue leafDec.dummy 1
execute unless block ~ ~ ~ #minecraft:leaves[persistent=false] run function fast_leaf_decay:destroy_marker
execute if score #continue leafDec.dummy matches 1 run function fast_leaf_decay:tick_marker_in_leaves