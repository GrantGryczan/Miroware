tag @s add leafDec.distant
execute if predicate fast_leaf_decay:should_decay run function fast_leaf_decay:decay
scoreboard players set #continue leafDec.dummy 0