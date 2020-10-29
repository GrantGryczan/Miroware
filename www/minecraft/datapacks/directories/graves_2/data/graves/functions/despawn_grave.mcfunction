execute store result score #remaining graves.dummy run data get storage graves:storage players
data modify storage graves:storage temp set from entity @s HandItems[1].tag.gravesData.uuid
execute store success score #success graves.dummy run data modify storage graves:storage temp set from storage graves:storage players[-1].uuid
execute if score #success graves.dummy matches 1 run function graves:rotate/player_as_grave
scoreboard players set #rotated graves.dummy 0
function graves:rotate/graves
data remove storage graves:storage players[-1].graves[-1]
scoreboard players remove #remaining graves.dummy 1
execute unless score #rotated graves.dummy matches 0 unless score #remaining graves.dummy matches 0 run function graves:rotate/back_grave
execute store result score #activated graves.dummy run data get entity @s HandItems[1].tag.gravesData.id
execute as @e[type=minecraft:armor_stand,tag=graves.model] run function graves:kill_model
playsound minecraft:block.stone.break block @a
particle minecraft:poof ~ ~0.7 ~ 0 0 0 0.05 10
kill @s