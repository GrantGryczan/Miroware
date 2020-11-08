summon minecraft:item_frame ~ ~1000 ~ {Tags:["craXPBot.enchTable","craXPBot.new"],Fixed:1b,Invisible:1b,Item:{id:"minecraft:enchanting_table",Count:1b,tag:{craXPBotData:{}}}}
data modify entity @e[type=minecraft:item_frame,tag=craXPBot.new,limit=1] Item.tag.craXPBotData set from block ~ ~ ~ {}
setblock ~ ~ ~ minecraft:snow[layers=6]
scoreboard players set #steps craXPBot.dummy 0
schedule function xp_management:restore_enchanting_tables 2t append