schedule function name_colors:tick 1t
execute as @a[scores={color=..-2}] run function name_colors:trigger
execute as @a[scores={color=0..}] run function name_colors:trigger
scoreboard players set @a color -1
scoreboard players enable @a color