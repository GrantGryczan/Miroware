tag @s remove leafDec.new
scoreboard players add #count leafDec.dummy 1
scoreboard players add @s leafDec.dummy 1
execute if score @s leafDec.dummy matches ..24 if score #count leafDec.dummy matches ..6400 run function fast_leaf_decay:check_surroundings
scoreboard players set @s leafDec.dummy 0