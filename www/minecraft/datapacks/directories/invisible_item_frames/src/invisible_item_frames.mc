function uninstall {
	schedule clear invisible_item_frames:tick
	schedule clear invisible_item_frames:schedule
}
clock 1t {
	name tick
	execute as @e[type=minecraft:area_effect_cloud,tag=invIteFra.marker] at @s unless entity @e[type=minecraft:item_frame,tag=invIteFra.itemFrame,distance=0] align xyz run {
		name break
		data merge entity @e[dx=0,dy=0,dz=0,type=minecraft:item,nbt={PickupDelay:10s,Item:{id:"minecraft:item_frame",Count:1b}},nbt=!{Item:{tag:{EntityTag:{}}}},limit=1] {Item:{tag:{display:{Name:'[{"text":"Invisible ","italic":false},{"translate":"item.minecraft.item_frame","italic":false}]'},EntityTag:{Tags:["invIteFra.placed"]}}}}
		kill @s
	}
}
clock 1s {
	name schedule
	execute as @e[type=minecraft:area_effect_cloud,tag=invIteFra.marker] run data modify entity @s Age set value -2147483648
	execute as @e[type=minecraft:item_frame,tag=invIteFra.invisible,nbt=!{Item:{}}] run {
		name set_visible
		data modify entity @s Invisible set value 0b
		tag @s remove invIteFra.invisible
	}
}
function activate_item_frame {
	advancement revoke @s only invisible_item_frames:activate_item_frame
	execute as @e[type=minecraft:item_frame,tag=!invIteFra.invisible,distance=..7,nbt={Item:{Count:1b}}] at @s run {
		name check_item_frame
		execute if entity @s[tag=invIteFra.itemFrame] run {
			name set_invisible
			data modify entity @s Invisible set value 1b
			tag @s add invIteFra.invisible
		}
		execute if entity @s[tag=!invIteFra.itemFrame,nbt={Item:{id:"minecraft:potion",tag:{Potion:"minecraft:long_invisibility"}}}] run {
			name consume_invisibility
			playsound minecraft:entity.generic.drink block @a
			data modify entity @s Item set value {id:"minecraft:glass_bottle",Count:1b}
			function invisible_item_frames:mark
			function invisible_item_frames:set_invisible
		}
	}
}
function use_item_frame {
	advancement revoke @s only invisible_item_frames:use_item_frame
	execute as @e[type=minecraft:item_frame,tag=invIteFra.placed,distance=..7] at @s run {
		name place
		tag @s remove invIteFra.placed
		function invisible_item_frames:mark
	}
}
function mark {
	tag @s add invIteFra.itemFrame
	summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["invIteFra.marker"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
}
