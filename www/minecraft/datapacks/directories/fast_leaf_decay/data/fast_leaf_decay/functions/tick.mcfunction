execute as @e[type=minecraft:item_frame,tag=leafDec.marker] at @s run function fast_leaf_decay:tick_marker
execute as @a[predicate=fast_leaf_decay:should_start_raycasting] at @s anchored eyes positioned ^ ^ ^ run function fast_leaf_decay:start_raycasting
schedule function fast_leaf_decay:tick 1t