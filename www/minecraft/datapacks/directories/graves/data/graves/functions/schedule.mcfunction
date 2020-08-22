schedule function graves:schedule 2s
execute as @e[type=minecraft:armor_stand,tag=graves.model] at @s positioned ~ ~1.375 ~ run function graves:fix_hitbox_position
execute in minecraft:overworld store result score #keepInventory graves.dummy run gamerule keepInventory
execute if score #keepInventory graves.dummy matches 0 if score #prevOverworldKeepInventory graves.dummy matches 1 run tellraw @a {"text":"The Graves data pack cannot read player inventories correctly unless gamerule keepInventory is true.","color":"red"}
scoreboard players operation #prevOverworldKeepInventory graves.dummy = #keepInventory graves.dummy
execute in minecraft:overworld store result score #doImmediateRespawn graves.dummy run gamerule doImmediateRespawn
execute if score #doImmediateRespawn graves.dummy matches 1 if score #prevOverworldDoImmediateRespawn graves.dummy matches 0 run tellraw @a {"text":"The Graves data pack cannot position graves correctly unless gamerule doImmediateRespawn is false.","color":"red"}
scoreboard players operation #prevOverworldDoImmediateRespawn graves.dummy = #doImmediateRespawn graves.dummy
execute if score #dimGameRules graves.dummy matches 1 run function graves:check_dimensional_game_rules