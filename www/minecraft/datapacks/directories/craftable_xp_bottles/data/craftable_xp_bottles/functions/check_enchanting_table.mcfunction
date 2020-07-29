summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["craXPBot.marker"]}
execute align y if entity @e[type=minecraft:area_effect_cloud,tag=craXPBot.marker,distance=..0.75] run function craftable_xp_bottles:replace_enchanting_table
kill @e[type=minecraft:area_effect_cloud,tag=craXPBot.marker]