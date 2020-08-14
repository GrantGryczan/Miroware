scoreboard players add @s leafDec.dummy 1
tag @s remove leafDec.new
execute if score @s leafDec.dummy matches ..50 run function fast_leaf_decay:check_surroundings