schedule function armored_elytra:schedule 1s
execute as @e[type=minecraft:item,tag=!armEly.elytra] at @s if block ~ ~-0.01 ~ #minecraft:anvil if entity @s[nbt={Item:{id:"minecraft:elytra",Count:1b}}] run function armored_elytra:tag_elytra
execute as @e[type=minecraft:item,tag=armEly.elytra,tag=!armEly.done] at @s if block ~ ~-0.01 ~ #minecraft:anvil run function armored_elytra:tick_elytra_on_anvil
execute as @e[type=minecraft:item,tag=!armEly.checkedForElytra] at @s if block ~ ~-0.01 ~ minecraft:grindstone run function armored_elytra:check_for_elytra_in_grindstone