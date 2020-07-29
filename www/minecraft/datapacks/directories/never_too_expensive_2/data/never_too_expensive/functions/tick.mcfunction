execute as @e[type=minecraft:item] at @s if block ~ ~ ~ minecraft:cauldron if data entity @s Item.tag.RepairCost if entity @s[nbt={Item:{Count:1b}}] store result score @s nevTooExp.cost run data get entity @s Item.tag.RepairCost
execute as @e[type=minecraft:item,scores={nevTooExp.cost=1..}] at @s run function never_too_expensive:tick_costly_item_in_cauldron
scoreboard players enable @a nevTooExp
execute as @a[scores={nevTooExp=1}] run function never_too_expensive:info
scoreboard players set @a nevTooExp 0
schedule function never_too_expensive:tick 1t