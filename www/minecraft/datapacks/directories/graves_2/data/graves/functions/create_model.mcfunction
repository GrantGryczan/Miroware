summon minecraft:armor_stand ~ ~ ~ {Tags:["graves.marker","graves.model","graves.new"],Marker:1b,Invisible:1b,NoGravity:1b,Invulnerable:1b,ArmorItems:[{},{},{},{id:"minecraft:stone_brick_wall",Count:1b,tag:{gravesData:{}}}],Air:32767s}
execute as @e[type=minecraft:armor_stand,tag=graves.new] run function graves:prepare_model
loot spawn ~ 1000 ~ loot graves:name_tag
tag @e[type=minecraft:item,nbt={Item:{tag:{gravesNameTag:1b}}}] add graves.nameTag
data modify entity @s CustomName set from entity @e[type=minecraft:item,tag=graves.nameTag,limit=1] Item.tag.display.Name
kill @e[type=minecraft:item,tag=graves.nameTag,limit=1]