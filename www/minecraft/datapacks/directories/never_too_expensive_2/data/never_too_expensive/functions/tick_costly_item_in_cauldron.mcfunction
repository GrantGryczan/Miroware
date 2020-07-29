tag @s add nevTooExp.subject
execute align xyz run tag @e[dx=0,dy=0,dz=0,type=minecraft:item,nbt={Item:{id:"minecraft:experience_bottle"}}] add nevTooExp.bottle
execute as @e[type=minecraft:item,tag=nevTooExp.bottle] store result score @s nevTooExp.count run data get entity @s Item.Count
execute as @e[type=minecraft:item,tag=nevTooExp.bottle] run scoreboard players operation @e[type=minecraft:item,tag=nevTooExp.subject] nevTooExp.count += @s nevTooExp.count
execute if score @s nevTooExp.count >= #bottles nevTooExp.config run function never_too_expensive:reduce_repair_cost
scoreboard players set @s nevTooExp.count 0
scoreboard players set @s nevTooExp.cost 0
tag @e[type=minecraft:item] remove nevTooExp.bottle
tag @s remove nevTooExp.subject