scoreboard players enable @a mulSle
scoreboard players enable @a mulSle.config
execute as @a[scores={mulSle=1..}] run function multiplayer_sleep:trigger
execute if score #sleeping mulSle.dummy matches 1.. run function multiplayer_sleep:check_sleeping
execute if score #sleeping mulSle.dummy matches -1 if predicate multiplayer_sleep:clear_day run scoreboard players set #sleeping mulSle.dummy 0
schedule function multiplayer_sleep:tick 1t