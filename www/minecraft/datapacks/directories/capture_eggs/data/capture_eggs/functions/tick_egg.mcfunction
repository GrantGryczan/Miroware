tag @s add capEgg.egg
data modify storage capture_eggs:storage temp set from entity @s {}
execute store result score #posX capEgg.dummy run data get storage capture_eggs:storage temp.Pos[0] 100
execute store result score #posY capEgg.dummy run data get storage capture_eggs:storage temp.Pos[1] 100
execute store result score #posZ capEgg.dummy run data get storage capture_eggs:storage temp.Pos[2] 100
execute store result score #motionX capEgg.dummy run data get storage capture_eggs:storage temp.Motion[0] 100
execute store result score #motionY capEgg.dummy run data get storage capture_eggs:storage temp.Motion[1] 100
execute store result score #motionZ capEgg.dummy run data get storage capture_eggs:storage temp.Motion[2] 100
execute store result storage capture_eggs:storage temp.Pos[0] double 0.01 run scoreboard players operation #posX capEgg.dummy -= #motionX capEgg.dummy
execute store result storage capture_eggs:storage temp.Pos[1] double 0.01 run scoreboard players operation #posY capEgg.dummy -= #motionY capEgg.dummy
execute store result storage capture_eggs:storage temp.Pos[2] double 0.01 run scoreboard players operation #posZ capEgg.dummy -= #motionZ capEgg.dummy
summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["capEgg.marker"]}
data modify entity @e[type=minecraft:area_effect_cloud,tag=capEgg.marker,distance=..8,limit=1] Pos set from storage capture_eggs:storage temp.Pos
scoreboard players set #steps capEgg.dummy 20
execute at @e[type=minecraft:area_effect_cloud,tag=capEgg.marker,distance=..8,limit=1] facing entity @s feet positioned as @s run function capture_eggs:check
kill @e[type=minecraft:area_effect_cloud,tag=capEgg.marker,distance=..8,limit=1]
tag @s remove capEgg.egg