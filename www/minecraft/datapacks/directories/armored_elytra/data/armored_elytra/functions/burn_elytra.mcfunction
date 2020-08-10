tag @s add armEly.subject
function armored_elytra:separate_enchantments/start
execute as @e[type=minecraft:item,tag=armEly.separated] run function armored_elytra:copy_burning_elytra_tags
kill @s