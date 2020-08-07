tag @s add graves.subject
execute as @e[type=minecraft:armor_stand,tag=graves.hitbox] if score @s graves.id = @e[type=minecraft:armor_stand,tag=graves.subject,limit=1] graves.id run tp @s ~ ~1.375 ~
tag @s remove graves.subject