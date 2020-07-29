execute in minecraft:the_nether store result score #keepInventory graves.dummy run gamerule keepInventory
execute if score #keepInventory graves.dummy matches 0 if score #prevNetherKeepInventory graves.dummy matches 1 run tellraw @a {"text":"The Graves data pack cannot read player inventories correctly unless gamerule keepInventory is true.","color":"red"}
scoreboard players operation #prevNetherKeepInventory graves.dummy = #keepInventory graves.dummy
execute in minecraft:the_end store result score #keepInventory graves.dummy run gamerule keepInventory
execute if score #keepInventory graves.dummy matches 0 if score #prevEndKeepInventory graves.dummy matches 1 run tellraw @a {"text":"The Graves data pack cannot read player inventories correctly unless gamerule keepInventory is true.","color":"red"}
scoreboard players operation #prevEndKeepInventory graves.dummy = #keepInventory graves.dummy
execute in minecraft:the_nether store result score #doImmediateRespawn graves.dummy run gamerule doImmediateRespawn
execute if score #doImmediateRespawn graves.dummy matches 1 if score #prevNetherDoImmediateRespawn graves.dummy matches 0 run tellraw @a {"text":"The Graves data pack cannot position graves correctly unless gamerule doImmediateRespawn is false.","color":"red"}
scoreboard players operation #prevNetherDoImmediateRespawn graves.dummy = #doImmediateRespawn graves.dummy
execute in minecraft:the_end store result score #doImmediateRespawn graves.dummy run gamerule doImmediateRespawn
execute if score #doImmediateRespawn graves.dummy matches 1 if score #prevEndDoImmediateRespawn graves.dummy matches 0 run tellraw @a {"text":"The Graves data pack cannot position graves correctly unless gamerule doImmediateRespawn is false.","color":"red"}
scoreboard players operation #prevEndDoImmediateRespawn graves.dummy = #doImmediateRespawn graves.dummy