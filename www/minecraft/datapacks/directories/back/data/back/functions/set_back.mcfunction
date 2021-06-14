execute unless entity @e[type=minecraft:marker,tag=back.dimension,limit=1,distance=0..] positioned 12940016 1000 17249568 run function back:try_to_start_to_mark_dimension
function back:rotate/players
data modify storage back:storage players[-1].back.dim set from entity @s Dimension
data modify storage back:storage players[-1].back.pos set from entity @s Pos
data modify storage back:storage players[-1].back.rot set from entity @s Rotation