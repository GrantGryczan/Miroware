schedule function custom_nether_portals:tick 1t
scoreboard players enable @a cusNetPor
execute as @a[scores={cusNetPor=1}] run function custom_nether_portals:info
scoreboard players set @a cusNetPor 0
execute as @a[scores={cusNetPor.useFAS=1..}] at @s run function custom_nether_portals:use_ignition
execute as @a[scores={cusNetPor.useFC=1..}] at @s run function custom_nether_portals:use_ignition