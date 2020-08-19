schedule function custom_nether_portals:tick 1t
scoreboard players enable @a cusNetPor
execute as @a[scores={cusNetPor=1}] run function custom_nether_portals:info