summon minecraft:item_frame ~ ~ ~ {Tags:["elevs.marker","elevs.new"],Fixed:1b,Invisible:1b,Facing:1b}
tag @e[type=minecraft:item_frame] remove elevs.new
particle minecraft:portal ~0.5 ~0.5 ~0.5 0.5 0.5 0.5 1 200
kill @s