schedule function armored_elytra:tick 1t
execute as @e[type=minecraft:item,tag=!armEly.checkedForElytraOnFire,predicate=armored_elytra:on_fire] run function armored_elytra:check_for_elytra_on_fire