playsound minecraft:entity.generic.drink block @a
data modify entity @s Item set value {id:"minecraft:glass_bottle",Count:1b}
tag @s add invIteFra.itemFrame
summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["invIteFra.marker"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
function invisible_item_frames:set_invisible