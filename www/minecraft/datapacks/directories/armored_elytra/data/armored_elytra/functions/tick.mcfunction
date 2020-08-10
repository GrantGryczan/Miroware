execute as @e[type=minecraft:item,tag=!armEly.elytra] at @s if block ~ ~-0.1 ~ #minecraft:anvil if entity @s[nbt={Item:{id:"minecraft:elytra",Count:1b}}] run tag @s add armEly.elytra
execute as @e[type=minecraft:item,tag=armEly.elytra,tag=!armEly.done] at @s if block ~ ~-1 ~ #minecraft:anvil run function armored_elytra:tick_elytra_on_anvil
execute as @e[type=minecraft:item,tag=!armEly.checkedForElytra] at @s if block ~ ~ ~ minecraft:grindstone run function armored_elytra:check_for_elytra_in_grindstone
execute as @e[type=minecraft:item,tag=!armEly.checkedForElytraOnFire,predicate=armored_elytra:on_fire] run function armored_elytra:check_for_elytra_on_fire
schedule function armored_elytra:tick 1t