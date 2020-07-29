function homes:rotate/players
execute store result score #homes homes.dummy run data get storage homes:storage players[-1].homes
execute if score #homes homes.dummy matches 0 run tellraw @s {"text":"You are homeless.","color":"red"}
execute unless score #homes homes.dummy matches 0 run function homes:list_homes
scoreboard players set @s homes 0