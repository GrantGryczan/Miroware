scoreboard players set #continue leafDec.dummy 1
execute as @e[type=minecraft:area_effect_cloud,tag=leafDec.marker,distance=..0.01] run function fast_leaf_decay:reset_marker
execute if score #continue leafDec.dummy matches 1 run summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["leafDec.marker","leafDec.front","leafDec.new"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}