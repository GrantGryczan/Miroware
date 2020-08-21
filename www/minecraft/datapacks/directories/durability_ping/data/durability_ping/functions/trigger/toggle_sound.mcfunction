scoreboard players operation #config duraPing.dummy = @s duraPing.config
scoreboard players operation #config duraPing.dummy %= #100 duraPing.dummy
execute if score #config duraPing.dummy matches 10.. run scoreboard players remove @s duraPing.config 10
execute unless score #config duraPing.dummy matches 10.. run scoreboard players add @s duraPing.config 10