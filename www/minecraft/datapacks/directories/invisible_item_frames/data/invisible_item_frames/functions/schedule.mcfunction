schedule function invisible_item_frames:schedule 1s
execute as @e[type=minecraft:area_effect_cloud,tag=invIteFra.marker] run data modify entity @s Age set value -2147483648
execute as @e[type=minecraft:item_frame,tag=invIteFra.invisible,nbt=!{Item:{}}] run function invisible_item_frames:set_visible