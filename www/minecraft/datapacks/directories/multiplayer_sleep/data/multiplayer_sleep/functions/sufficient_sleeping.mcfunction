function multiplayer_sleep:reset_progress
scoreboard players set #sleeping mpSleep.dummy 0
execute unless score #asleep mpSleep.dummy = #canSleep mpSleep.dummy run function multiplayer_sleep:handle_skip
execute if predicate multiplayer_sleep:raining run weather rain 1
execute if predicate multiplayer_sleep:thundering run weather thunder 1
execute unless predicate multiplayer_sleep:raining_or_thundering if score #alwaysClear mpSleep.config matches 1 run weather rain 1