tag @s remove leafDec.new
scoreboard players add @s leafDec.dummy 1
execute unless entity @s[tag=leafDec.front] run function fast_leaf_decay:check_marker