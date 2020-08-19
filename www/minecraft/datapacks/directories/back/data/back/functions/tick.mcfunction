schedule function back:tick 1t
scoreboard players enable @a back
execute as @a[scores={back=1..}] at @s run function back:trigger_back
execute as @a[scores={back.delay=0..}] run function back:try_to_try_to_try_to_go_back
execute as @a[scores={back.deaths=1..}] run function back:death