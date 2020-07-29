execute at @s run function back:set_back
summon minecraft:area_effect_cloud ~ ~ ~ {UUID:[I;979080763,-320714047,-1824712708,-415795266]}
function spawn:offset_up
execute if block ~ ~ ~ minecraft:air run function spawn:offset_down
kill 3a5b963b-ece2-4ac1-933d-17fce73777be