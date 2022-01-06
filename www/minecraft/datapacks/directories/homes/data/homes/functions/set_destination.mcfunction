execute unless score #cooldown homes.config matches 0 run scoreboard players operation @a[tag=homes.subject,limit=1] homes.cooldown = #cooldown homes.config
execute as @a[tag=homes.subject,limit=1] at @s run function back:set_back
data modify entity @s Pos set from storage homes:storage players[-1].homes[-1].pos
data modify entity @s Rotation set from storage homes:storage players[-1].homes[-1].rot
tp @a[tag=homes.subject,limit=1] @s
kill @s