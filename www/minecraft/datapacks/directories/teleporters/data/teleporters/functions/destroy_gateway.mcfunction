summon minecraft:item ~ ~ ~ {Tags:["tpers.compass"],PickupDelay:10s,Item:{id:"minecraft:compass",Count:1b}}
data modify entity @e[type=minecraft:item,tag=tpers.compass,limit=1] Item set from entity @s Item
tag @e[type=minecraft:item,tag=tpers.compass] add tpers.done
tag @e[type=minecraft:item] remove tpers.compass
execute if block ~ ~ ~ minecraft:end_gateway run setblock ~ ~ ~ minecraft:air destroy
playsound minecraft:block.beacon.deactivate block @a ~ ~ ~
particle minecraft:reverse_portal ~ ~ ~ 0.25 0.25 0.25 0.25 250
kill @s