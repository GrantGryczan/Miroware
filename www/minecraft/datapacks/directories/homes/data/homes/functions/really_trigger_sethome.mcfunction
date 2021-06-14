function homes:rotate/players
scoreboard players operation #home homes.dummy = @s sethome
function homes:rotate/homes
execute if score #remaining homes.dummy matches 0 run function homes:try_to_add_home
execute unless score #remaining homes.dummy matches 0 run function homes:set_home
scoreboard players set @s sethome 0