execute store success score #sleeping mulSle.dummy as @a[gamemode=!spectator,predicate=multiplayer_sleep:overworld] if data entity @s SleepingX run tag @s add mulSle.sleeping
execute if score #sleeping mulSle.dummy matches 0 run tellraw @s {"text":"There are no sleeping players.","color":"red"}
execute unless score #sleeping mulSle.dummy matches 0 run tellraw @s [{"text":"Sleeping players: ","color":"dark_aqua"},{"selector":"@a[tag=mulSle.sleeping]","color":"aqua"}]
tag @a remove mulSle.sleeping