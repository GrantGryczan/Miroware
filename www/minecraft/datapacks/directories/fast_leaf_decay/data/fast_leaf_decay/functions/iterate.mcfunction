summon minecraft:item_frame ~ ~ ~ {Tags:["leafDec.marker","leafDec.new"],Fixed:1b,Invisible:1b}
scoreboard players operation @e[type=minecraft:item_frame,tag=leafDec.new] leafDec.dummy = @s[type=minecraft:item_frame] leafDec.dummy
execute as @e[type=minecraft:item_frame,tag=leafDec.new] run function fast_leaf_decay:try_to_check_surroundings