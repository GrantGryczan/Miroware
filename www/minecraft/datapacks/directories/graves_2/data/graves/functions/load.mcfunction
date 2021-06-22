scoreboard objectives add graves.config dummy "Graves Config"
scoreboard objectives add graves.deaths deathCount
scoreboard objectives add graves.id dummy
scoreboard objectives add graves.dummy dummy
scoreboard objectives add graves.age dummy
scoreboard objectives add graves.api dummy
scoreboard objectives add grave trigger "Locate Last Grave"
execute unless score #robbing graves.config matches 0..1 run scoreboard players set #robbing graves.config 0
execute unless score #xp graves.config matches 0..1 run scoreboard players set #xp graves.config 1
execute unless score #locating graves.config matches 0..1 run scoreboard players set #locating graves.config 1
execute unless score #despawn graves.config matches 0.. run scoreboard players set #despawn graves.config 0
scoreboard players set #pointsPerLevel graves.dummy 7
scoreboard players set #prevOverworldDoImmediateRespawn graves.dummy 0
scoreboard players set #prevNetherDoImmediateRespawn graves.dummy 0
scoreboard players set #prevEndDoImmediateRespawn graves.dummy 0
execute in minecraft:overworld run gamerule keepInventory true
execute in minecraft:the_nether run gamerule keepInventory false
execute in minecraft:overworld store result score #dimGameRules graves.dummy run gamerule keepInventory
execute in minecraft:the_nether run gamerule keepInventory true
execute in minecraft:the_end run gamerule keepInventory true
scoreboard players reset * graves.deaths
execute as @e[type=minecraft:armor_stand,tag=graves.hitbox] run function graves:load_hitbox
execute as @e[type=minecraft:armor_stand,tag=graves.model] store result score @s graves.id run data get entity @s ArmorItems[3].tag.gravesData.id
advancement revoke @a only graves:interact_with_grave