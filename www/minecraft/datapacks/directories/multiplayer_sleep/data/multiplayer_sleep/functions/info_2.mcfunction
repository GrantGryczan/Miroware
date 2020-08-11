execute store success score #sleeping mpSleep.dummy as @a[gamemode=!spectator,predicate=multiplayer_sleep:overworld] if data entity @s SleepingX run tag @s add mpSleep.sleeping
execute if score #sleeping mpSleep.dummy matches 0 run tellraw @s {"text":"There are no sleeping players.","color":"red"}
execute unless score #sleeping mpSleep.dummy matches 0 run tellraw @s [{"text":"Sleeping players: ","color":"dark_aqua"},{"selector":"@a[tag=mpSleep.sleeping]","color":"aqua"}]
tag @a remove mpSleep.sleeping