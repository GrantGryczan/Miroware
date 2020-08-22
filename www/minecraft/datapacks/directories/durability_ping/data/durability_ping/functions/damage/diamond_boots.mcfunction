advancement revoke @s only durability_ping:damage/diamond_boots
scoreboard players set #durability duraPing.dummy 429
data modify storage durability_ping:storage name set value '{"translate":"item.minecraft.diamond_boots","color":"gold"}'
scoreboard players set @s duraPing.armor 60
data modify storage durability_ping:storage itemTag set from entity @s Inventory[{Slot:100b}].tag
execute store result score #damage duraPing.dummy run data get storage durability_ping:storage itemTag.Damage
execute if data storage durability_ping:storage itemTag.display.Name run data modify storage durability_ping:storage name set value '{"storage":"durability_ping:storage","nbt":"itemTag.display.Name","interpret":true,"italic":true}'
scoreboard players operation #durability duraPing.dummy -= #damage duraPing.dummy
scoreboard players operation #config duraPing.dummy = #default duraPing.config
execute if score @s duraPing.config matches 0.. run scoreboard players operation #config duraPing.dummy = @s duraPing.config
scoreboard players operation #config duraPing.dummy %= #100 duraPing.dummy
execute if score #config duraPing.dummy matches 10.. at @s run playsound minecraft:block.anvil.land master @s ~ ~ ~ 1 2
scoreboard players operation #config duraPing.dummy %= #10 duraPing.dummy
execute if score #config duraPing.dummy matches 1..2 run title @s reset
execute if score #config duraPing.dummy matches 1 run title @s title ""
execute if score #damage duraPing.dummy matches 0 if score #config duraPing.dummy matches 1 run title @s subtitle ["",{"storage":"durability_ping:storage","nbt":"name","interpret":true,"color":"gold"},{"text":" durability low!","color":"red"}]
execute unless score #damage duraPing.dummy matches 0 if score #config duraPing.dummy matches 1 run title @s subtitle ["",{"storage":"durability_ping:storage","nbt":"name","interpret":true,"color":"gold"},{"text":" durability low! ","color":"red"},{"score":{"name":"#durability","objective":"duraPing.dummy"},"color":"gold"},{"text":" of 429 remaining.","color":"red"}]
execute if score #config duraPing.dummy matches 2 run title @s title ["",{"storage":"durability_ping:storage","nbt":"name","interpret":true,"color":"gold"},{"text":" durability low!","color":"red"}]
execute unless score #damage duraPing.dummy matches 0 if score #config duraPing.dummy matches 2 run title @s subtitle [{"score":{"name":"#durability","objective":"duraPing.dummy"},"color":"gold"},{"text":" of 429 remaining.","color":"red"}]
execute if score #damage duraPing.dummy matches 0 if score #config duraPing.dummy matches 3 run tellraw @s ["",{"storage":"durability_ping:storage","nbt":"name","interpret":true,"color":"gold"},{"text":" durability low!","color":"red"}]
execute unless score #damage duraPing.dummy matches 0 if score #config duraPing.dummy matches 3 run tellraw @s ["",{"storage":"durability_ping:storage","nbt":"name","interpret":true,"color":"gold"},{"text":" durability low! ","color":"red"},{"score":{"name":"#durability","objective":"duraPing.dummy"},"color":"gold"},{"text":" of 429 remaining.","color":"red"}]
execute if score #damage duraPing.dummy matches 0 if score #config duraPing.dummy matches 4 run title @s actionbar ["",{"storage":"durability_ping:storage","nbt":"name","interpret":true,"color":"gold"},{"text":" durability low!","color":"red"}]
execute unless score #damage duraPing.dummy matches 0 if score #config duraPing.dummy matches 4 run title @s actionbar ["",{"storage":"durability_ping:storage","nbt":"name","interpret":true,"color":"gold"},{"text":" durability low! ","color":"red"},{"score":{"name":"#durability","objective":"duraPing.dummy"},"color":"gold"},{"text":" of 429 remaining.","color":"red"}]
data remove storage durability_ping:storage itemTag