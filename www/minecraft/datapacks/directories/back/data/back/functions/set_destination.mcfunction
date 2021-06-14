execute unless score #cooldown back.config matches 0 run scoreboard players operation @a[tag=back.subject,limit=1] back.cooldown = #cooldown back.config
data modify entity @s Pos set from storage back:storage players[-1].back.pos
data modify entity @s Rotation set from storage back:storage players[-1].back.rot
execute as @a[tag=back.subject,limit=1] at @s run function back:set_back
tp @a[tag=back.subject,limit=1] @s
kill @s