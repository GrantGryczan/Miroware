tag @s add graves.player
function graves:rotate/players
execute store result score #id graves.dummy run data get storage graves:storage lastGrave
data modify storage graves:storage players[-1].graves append value {}
execute store result storage graves:storage players[-1].graves[-1].id int 1 run scoreboard players add #id graves.dummy 1
data modify storage graves:storage players[-1].graves[-1].dim set from entity @s Dimension
execute store result storage graves:storage lastGrave int 1 run scoreboard players get #id graves.dummy
summon minecraft:armor_stand ~ ~ ~ {Tags:["graves.marker","graves.hitbox","graves.new"],Invisible:1b,NoGravity:1b,Invulnerable:1b,Small:1b,DisabledSlots:256,HandItems:[{id:"minecraft:stone_button",Count:1b,tag:{gravesData:{items:[]}}},{id:"minecraft:stone_button",Count:2b,tag:{gravesData:{}}}],Pose:{RightArm:[0.0f,-90.0f,0.0f],LeftArm:[0.0f,90.0f,0.0f],Head:[180.0f,0.0f,0.0f]},Silent:1b}
data modify entity @e[type=minecraft:armor_stand,tag=graves.new,limit=1] HandItems[0].tag.gravesData.items set from entity @s Inventory
replaceitem entity @s hotbar.0 minecraft:air
replaceitem entity @s hotbar.1 minecraft:air
replaceitem entity @s hotbar.2 minecraft:air
replaceitem entity @s hotbar.3 minecraft:air
replaceitem entity @s hotbar.4 minecraft:air
replaceitem entity @s hotbar.5 minecraft:air
replaceitem entity @s hotbar.6 minecraft:air
replaceitem entity @s hotbar.7 minecraft:air
replaceitem entity @s hotbar.8 minecraft:air
replaceitem entity @s weapon.offhand minecraft:air
replaceitem entity @s inventory.0 minecraft:air
replaceitem entity @s inventory.1 minecraft:air
replaceitem entity @s inventory.2 minecraft:air
replaceitem entity @s inventory.3 minecraft:air
replaceitem entity @s inventory.4 minecraft:air
replaceitem entity @s inventory.5 minecraft:air
replaceitem entity @s inventory.6 minecraft:air
replaceitem entity @s inventory.7 minecraft:air
replaceitem entity @s inventory.8 minecraft:air
replaceitem entity @s inventory.9 minecraft:air
replaceitem entity @s inventory.10 minecraft:air
replaceitem entity @s inventory.11 minecraft:air
replaceitem entity @s inventory.12 minecraft:air
replaceitem entity @s inventory.13 minecraft:air
replaceitem entity @s inventory.14 minecraft:air
replaceitem entity @s inventory.15 minecraft:air
replaceitem entity @s inventory.16 minecraft:air
replaceitem entity @s inventory.17 minecraft:air
replaceitem entity @s inventory.18 minecraft:air
replaceitem entity @s inventory.19 minecraft:air
replaceitem entity @s inventory.20 minecraft:air
replaceitem entity @s inventory.21 minecraft:air
replaceitem entity @s inventory.22 minecraft:air
replaceitem entity @s inventory.23 minecraft:air
replaceitem entity @s inventory.24 minecraft:air
replaceitem entity @s inventory.25 minecraft:air
replaceitem entity @s inventory.26 minecraft:air
replaceitem entity @s armor.feet minecraft:air
replaceitem entity @s armor.legs minecraft:air
replaceitem entity @s armor.chest minecraft:air
replaceitem entity @s armor.head minecraft:air
execute as @e[type=minecraft:armor_stand,tag=graves.new] run function graves:prepare_grave
tag @s remove graves.player