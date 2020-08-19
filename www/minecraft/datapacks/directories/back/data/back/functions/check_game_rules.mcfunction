schedule function back:check_game_rules 5s
execute in minecraft:overworld store result score #doImmediateRespawn back.dummy run gamerule doImmediateRespawn
execute if score #doImmediateRespawn back.dummy matches 1 if score #prevOverworldDoImmediateRespawn back.dummy matches 0 run tellraw @a {"text":"The Back data pack cannot detect your death location correctly unless gamerule doImmediateRespawn is false. You may ignore this message if death location saving is disabled.","color":"red"}
scoreboard players operation #prevOverworldDoImmediateRespawn back.dummy = #doImmediateRespawn back.dummy
execute if score #dimGameRules back.dummy matches 1 run function back:check_dimensional_game_rules