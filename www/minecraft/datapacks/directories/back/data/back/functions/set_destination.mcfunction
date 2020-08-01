data modify entity @s Pos set from storage back:storage players[-1].back.pos
data modify entity @s Rotation set from storage back:storage players[-1].back.rot
execute as @a[tag=back.subject] at @s run function back:set_back
tp @a[tag=back.subject] @s
kill @s