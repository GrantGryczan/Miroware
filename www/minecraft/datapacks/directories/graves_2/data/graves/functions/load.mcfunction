scoreboard objectives add graves.config dummy "Graves Config"
scoreboard objectives add graves.deaths deathCount
scoreboard objectives add graves.id dummy
scoreboard objectives add graves.sneak minecraft.custom:minecraft.sneak_time
scoreboard objectives add graves.dummy dummy
scoreboard objectives add grave trigger "Locate Last Grave"
execute unless score #robbing graves.config matches 0..1 run scoreboard players set #robbing graves.config 0
execute unless score #xp graves.config matches 0..1 run scoreboard players set #xp graves.config 1
execute unless score #locating graves.config matches 0..1 run scoreboard players set #locating graves.config 1
scoreboard players set #pointsPerLevel graves.dummy 7
scoreboard players set #prevOverworldDoImmediateRespawn graves.dummy 0
scoreboard players set #prevNetherDoImmediateRespawn graves.dummy 0
scoreboard players set #prevEndDoImmediateRespawn graves.dummy 0
execute in minecraft:the_nether run gamerule keepInventory false
execute in minecraft:overworld run gamerule keepInventory true
execute in minecraft:overworld store result score #universalGameRules graves.dummy run gamerule keepInventory
execute in minecraft:the_nether run gamerule keepInventory true
execute in minecraft:the_end run gamerule keepInventory true