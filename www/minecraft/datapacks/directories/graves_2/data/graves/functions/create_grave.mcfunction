tag @s add graves.player
function graves:rotate/players
execute store result score #id graves.dummy run data get storage graves:storage lastGrave
data modify storage graves:storage players[-1].graves append value {}
execute store result storage graves:storage players[-1].graves[-1].id int 1 run scoreboard players add #id graves.dummy 1
data modify storage graves:storage players[-1].graves[-1].dim set from entity @s Dimension
execute store result storage graves:storage lastGrave int 1 run scoreboard players get #id graves.dummy
summon minecraft:armor_stand ~ ~ ~ {Tags:["graves.marker","graves.hitbox","graves.new"],Invisible:1b,NoGravity:1b,Invulnerable:1b,Small:1b,DisabledSlots:256,HandItems:[{id:"minecraft:stone_button",Count:1b,tag:{gravesData:{items:[]}}},{id:"minecraft:stone_button",Count:2b,tag:{gravesData:{}}}],Pose:{RightArm:[0.0f,-90.0f,0.0f],LeftArm:[0.0f,90.0f,0.0f],Head:[180.0f,0.0f,0.0f]},Silent:1b}
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:0b}]
item replace entity @s hotbar.0 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:1b}]
item replace entity @s hotbar.1 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:2b}]
item replace entity @s hotbar.2 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:3b}]
item replace entity @s hotbar.3 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:4b}]
item replace entity @s hotbar.4 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:5b}]
item replace entity @s hotbar.5 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:6b}]
item replace entity @s hotbar.6 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:7b}]
item replace entity @s hotbar.7 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:8b}]
item replace entity @s hotbar.8 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:-106b}]
item replace entity @s weapon.offhand with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:9b}]
item replace entity @s inventory.0 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:10b}]
item replace entity @s inventory.1 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:11b}]
item replace entity @s inventory.2 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:12b}]
item replace entity @s inventory.3 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:13b}]
item replace entity @s inventory.4 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:14b}]
item replace entity @s inventory.5 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:15b}]
item replace entity @s inventory.6 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:16b}]
item replace entity @s inventory.7 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:17b}]
item replace entity @s inventory.8 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:18b}]
item replace entity @s inventory.9 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:19b}]
item replace entity @s inventory.10 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:20b}]
item replace entity @s inventory.11 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:21b}]
item replace entity @s inventory.12 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:22b}]
item replace entity @s inventory.13 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:23b}]
item replace entity @s inventory.14 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:24b}]
item replace entity @s inventory.15 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:25b}]
item replace entity @s inventory.16 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:26b}]
item replace entity @s inventory.17 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:27b}]
item replace entity @s inventory.18 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:28b}]
item replace entity @s inventory.19 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:29b}]
item replace entity @s inventory.20 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:30b}]
item replace entity @s inventory.21 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:31b}]
item replace entity @s inventory.22 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:32b}]
item replace entity @s inventory.23 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:33b}]
item replace entity @s inventory.24 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:34b}]
item replace entity @s inventory.25 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:35b}]
item replace entity @s inventory.26 with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:100b}]
item replace entity @s armor.feet with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:101b}]
item replace entity @s armor.legs with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:102b}]
item replace entity @s armor.chest with minecraft:air
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items append from entity @s Inventory[{Slot:103b}]
item replace entity @s armor.head with minecraft:air
execute as @e[type=minecraft:armor_stand,tag=graves.new] run function graves:prepare_grave
tag @s remove graves.player