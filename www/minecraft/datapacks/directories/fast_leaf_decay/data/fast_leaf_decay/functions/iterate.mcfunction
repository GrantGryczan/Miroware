summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["leafDec.marker","leafDec.new"],Duration:1200}
scoreboard players operation @e[type=minecraft:area_effect_cloud,tag=leafDec.new] leafDec.dummy = @s[type=minecraft:area_effect_cloud] leafDec.dummy
execute as @e[type=minecraft:area_effect_cloud,tag=leafDec.new] run function fast_leaf_decay:try_to_check_surroundings