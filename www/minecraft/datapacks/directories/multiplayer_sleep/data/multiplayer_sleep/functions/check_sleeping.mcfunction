execute as @a[predicate=multiplayer_sleep:overworld] at @s run tag @s add mulSle.total
execute store result score #total mulSle.dummy if entity @a[tag=mulSle.total,gamemode=!spectator]
execute as @a[tag=mulSle.total,gamemode=!spectator] if data entity @s SleepingX run tag @s add mulSle.sleeping
execute store result score #sleeping mulSle.dummy if entity @a[tag=mulSle.sleeping]
execute if score #sleeping mulSle.dummy matches 0 run function multiplayer_sleep:reset_progress
execute unless score #sleeping mulSle.dummy matches 0 run function multiplayer_sleep:sleeping
tag @a remove mulSle.total