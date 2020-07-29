execute store result score @s conCre.dummy run data get entity @s UUID[0]
scoreboard players operation @s conCre.dummy %= #total conCre.config
execute if score @s conCre.dummy < #chance conCre.config run tag @s add conCre.lucky
data modify entity @s[tag=conCre.lucky] ExplosionRadius set value 0b
tag @s add conCre.ready