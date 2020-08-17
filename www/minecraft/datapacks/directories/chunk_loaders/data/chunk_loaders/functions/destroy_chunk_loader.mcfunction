forceload remove ~ ~
execute store result score #doTileDrops chuLoa.dummy run gamerule doTileDrops
execute if score #doTileDrops chuLoa.dummy matches 1 run summon minecraft:item ~ ~0.5 ~ {Item:{id:"minecraft:nether_star",Count:1b},PickupDelay:10s}
particle minecraft:smoke ~ ~0.5 ~ 0.25 0.25 0.25 0.02 150
playsound minecraft:block.respawn_anchor.deplete block @a ~ ~ ~ 1 0.5
kill @s