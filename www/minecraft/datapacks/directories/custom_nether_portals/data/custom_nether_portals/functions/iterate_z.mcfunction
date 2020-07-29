summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["cusNetPor.marker"]}
execute if block ~ ~ ~ minecraft:obsidian run scoreboard players add #size cusNetPor.dummy 1
execute if score #size cusNetPor.dummy > #maxSize cusNetPor.config run scoreboard players set #success cusNetPor.dummy -1
execute if score #success cusNetPor.dummy matches 0 unless block ~ ~ ~ minecraft:obsidian run function custom_nether_portals:continue_z