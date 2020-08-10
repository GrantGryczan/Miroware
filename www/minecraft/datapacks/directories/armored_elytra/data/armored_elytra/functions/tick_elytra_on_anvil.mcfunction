tag @s add armEly.subject
execute align xyz as @e[type=minecraft:item,tag=!armEly.elytra,dx=0,dy=0,dz=0] run function armored_elytra:check_for_chestplate
tag @s remove armEly.subject