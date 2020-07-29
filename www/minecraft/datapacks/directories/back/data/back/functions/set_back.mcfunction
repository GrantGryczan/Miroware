execute unless entity @e[type=minecraft:item_frame,tag=back.dimension,distance=0..] positioned 12940016 1000 17249568 run function back:summon_dimension_marker
function back:rotate/players
data modify storage back:storage players[-1].back.dim set from entity @e[type=minecraft:item_frame,tag=back.dimension,distance=0..,limit=1] Item.tag.backData.id
data modify storage back:storage players[-1].back.pos set from entity @s Pos
data modify storage back:storage players[-1].back.rot set from entity @s Rotation