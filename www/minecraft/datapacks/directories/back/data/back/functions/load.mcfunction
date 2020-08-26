scoreboard objectives add back trigger "Back"
scoreboard objectives add back.config dummy "Back Config"
scoreboard objectives add back.dummy dummy
scoreboard objectives add back.delay dummy
scoreboard objectives add back.cooldown dummy
scoreboard objectives add back.deaths deathCount
scoreboard objectives add back.x dummy
scoreboard objectives add back.y dummy
scoreboard objectives add back.z dummy
execute unless score #death back.config matches 0..1 run scoreboard players set #death back.config 0
execute unless score #delay back.config matches 0.. run scoreboard players set #delay back.config 0
execute unless score #cooldown back.config matches 0.. run scoreboard players set #cooldown back.config 0
execute in minecraft:overworld store result score #prevOverworldDoImmediateRespawn back.dummy run gamerule doImmediateRespawn
execute in minecraft:the_nether store result score #prevNetherDoImmediateRespawn back.dummy run gamerule doImmediateRespawn
execute in minecraft:overworld run gamerule doImmediateRespawn true
execute in minecraft:the_nether run gamerule doImmediateRespawn false
execute in minecraft:overworld store result score #dimGameRules back.dummy run gamerule doImmediateRespawn
execute if score #prevOverworldDoImmediateRespawn back.dummy matches 0 in minecraft:overworld run gamerule doImmediateRespawn false
execute if score #prevOverworldDoImmediateRespawn back.dummy matches 1 in minecraft:overworld run gamerule doImmediateRespawn true
execute if score #prevNetherDoImmediateRespawn back.dummy matches 1 in minecraft:the_nether run gamerule doImmediateRespawn true
scoreboard players set #prevOverworldDoImmediateRespawn back.dummy 0
scoreboard players set #prevNetherDoImmediateRespawn back.dummy 0
scoreboard players set #prevEndDoImmediateRespawn back.dummy 0
scoreboard players reset * back.deaths