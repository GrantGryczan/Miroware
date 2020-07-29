tag @s[scores={nevTooExp.cost=40..}] add nevTooExp.levelDown
scoreboard players operation @s nevTooExp.cost -= #levels nevTooExp.config
execute unless score @s nevTooExp.cost matches 0.. run scoreboard players set @s nevTooExp.cost 0
execute store result entity @s Item.tag.RepairCost int 1 run scoreboard players get @s nevTooExp.cost
tag @s[scores={nevTooExp.cost=40..}] remove nevTooExp.levelDown
tag @s[scores={nevTooExp.cost=0}] add nevTooExp.levelDown
execute if entity @s[tag=nevTooExp.levelDown] run playsound minecraft:entity.player.levelup block @a ~ ~ ~ 1 1.3
execute unless entity @s[tag=nevTooExp.levelDown] run playsound minecraft:entity.experience_orb.pickup block @a ~ ~ ~ 0.5 1.3
tag @s remove nevTooExp.levelDown
scoreboard players operation @s nevTooExp.count = #bottles nevTooExp.config
execute as @e[type=minecraft:item,tag=nevTooExp.bottle] if score @e[type=minecraft:item,tag=nevTooExp.subject,limit=1] nevTooExp.count matches 1.. run function never_too_expensive:subtract