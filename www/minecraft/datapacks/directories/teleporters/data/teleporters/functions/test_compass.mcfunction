data modify entity @s Item.tag.tpersDimension set from entity @s Item.tag.LodestoneDimension
execute store success score @s tpers.dummy run data modify entity @s Item.tag.tpersDimension set from entity @a[distance=0..,limit=1] Dimension
data remove entity @s Item.tag.tpersDimension
execute unless data entity @s Item.tag.LodestonePos run scoreboard players set @s tpers.dummy 1
execute if score @s tpers.dummy matches 1 run function teleporters:fail
execute if score @s tpers.dummy matches 0 align xyz positioned ~0.5 ~0.5 ~0.5 run function teleporters:create_gateway