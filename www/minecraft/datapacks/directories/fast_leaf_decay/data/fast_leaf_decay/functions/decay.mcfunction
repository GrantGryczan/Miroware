execute store result score #doTileDrops leafDec.dummy run gamerule doTileDrops
execute if score #doTileDrops leafDec.dummy matches 1 run loot spawn ~0.5 ~0.5 ~0.5 mine ~ ~ ~
setblock ~ ~ ~ minecraft:air
kill @s