function homes:rotate/players
scoreboard players operation #home homes.dummy = @s home
function homes:rotate/homes
execute if score #remaining homes.dummy matches 0 run tellraw @s [{"text":"Home ","color":"red"},{"score":{"name":"#home","objective":"homes.dummy"},"color":"red"},{"text":" not found.","color":"red"}]
execute unless score #remaining homes.dummy matches 0 run function homes:start_to_go_home