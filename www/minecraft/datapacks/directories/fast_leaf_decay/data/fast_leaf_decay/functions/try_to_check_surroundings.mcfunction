tag @s remove leafDec.new
scoreboard players add @s leafDec.dummy 1
execute if score @s leafDec.dummy matches ..1000 run function fast_leaf_decay:check_surroundings
scoreboard players set @s leafDec.dummy 0
setblock ~ ~ ~ cobweb