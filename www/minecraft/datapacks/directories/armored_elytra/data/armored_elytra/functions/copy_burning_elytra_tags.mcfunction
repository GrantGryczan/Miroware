data modify storage armored_elytra:storage temp set from entity @e[type=minecraft:item,tag=armEly.subject,limit=1] {}
data modify entity @s Motion set from storage armored_elytra:storage temp.Motion
data modify entity @s Fire set from storage armored_elytra:storage temp.Fire
data modify entity @s PickupDelay set from storage armored_elytra:storage temp.PickupDelay
data modify entity @s Owner set from storage armored_elytra:storage temp.Owner
tag @s remove armEly.separated