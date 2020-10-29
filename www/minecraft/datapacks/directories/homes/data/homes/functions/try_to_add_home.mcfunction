execute if score @s homes.limit matches 0.. run scoreboard players operation #limit homes.dummy = @s homes.limit
execute unless score @s homes.limit matches 0.. run scoreboard players operation #limit homes.dummy = #limit homes.config
execute if score #homes homes.dummy < #limit homes.dummy run function homes:add_home
execute unless score #homes homes.dummy < #limit homes.dummy run tellraw @s [{"text":"You can only set a maximum of ","color":"red"},{"score":{"name":"#limit","objective":"homes.dummy"},"color":"red"},{"text":" home(s).","color":"red"}]