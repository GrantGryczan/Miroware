schedule function multiplayer_sleep:tick 1t
execute as @a[scores={mpSleep=1..}] run function multiplayer_sleep:trigger
execute if score #sleeping mpSleep.dummy matches 1.. run function multiplayer_sleep:check_sleeping
execute if score #sleeping mpSleep.dummy matches -1 if predicate multiplayer_sleep:clear_day run scoreboard players set #sleeping mpSleep.dummy 0