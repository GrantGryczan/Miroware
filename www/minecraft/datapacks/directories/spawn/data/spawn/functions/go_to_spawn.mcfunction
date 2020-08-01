summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["spawn.destination"]}
function spawn:offset_up
execute if block ~ ~ ~ minecraft:air run function spawn:offset_down
kill @e[type=minecraft:area_effect_cloud,tag=spawn.destination]