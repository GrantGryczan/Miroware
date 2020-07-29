scoreboard players enable @a cusNetPor
execute as @a[scores={cusNetPor=1}] run function custom_nether_portals:info
scoreboard players set @a cusNetPor 0
schedule function custom_nether_portals:tick 1t