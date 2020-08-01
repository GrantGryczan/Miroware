data modify entity @s Pos set from storage homes:storage players[-1].homes[-1].pos
data modify entity @s Rotation set from storage homes:storage players[-1].homes[-1].rot
tp @a[tag=homes.subject] @s
kill @s