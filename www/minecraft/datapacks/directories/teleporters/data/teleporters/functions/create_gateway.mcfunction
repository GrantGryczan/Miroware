setblock ~ ~ ~ minecraft:end_gateway{ExactTeleport:1b}
data modify block ~ ~ ~ ExitPortal set from entity @s Item.tag.LodestonePos
execute store result score @s tpers.dummy run data get block ~ ~ ~ ExitPortal.Y
scoreboard players add @s tpers.dummy 1
execute store result block ~ ~ ~ ExitPortal.Y int 1 run scoreboard players get @s tpers.dummy
summon minecraft:item_frame ~ ~-1 ~ {Tags:["tpers.gateway","tpers.new"],Fixed:1b,Invisible:1b}
data modify entity @e[type=minecraft:item_frame,tag=tpers.new,limit=1] Item set from entity @s Item
tag @e[type=minecraft:item_frame] remove tpers.new
playsound minecraft:block.beacon.activate block @a
kill @s