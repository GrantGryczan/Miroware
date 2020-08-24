scoreboard players add @s leafDec.dummy 1
execute if score @s leafDec.dummy matches 8.. unless entity @s[tag=leafDec.front] run function fast_leaf_decay:check_marker