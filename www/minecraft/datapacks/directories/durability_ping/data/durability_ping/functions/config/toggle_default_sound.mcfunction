scoreboard players operation #config duraPing.dummy = #default duraPing.config
scoreboard players operation #config duraPing.dummy %= #100 duraPing.dummy
execute if score #config duraPing.dummy matches 10.. run scoreboard players remove #default duraPing.config 10
execute unless score #config duraPing.dummy matches 10.. run scoreboard players add #default duraPing.config 10
function durability_ping:config