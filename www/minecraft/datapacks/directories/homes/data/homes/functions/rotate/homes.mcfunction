execute store result score #homes homes.dummy run data get storage homes:storage players[-1].homes
scoreboard players operation #remaining homes.dummy = #homes homes.dummy
execute store result score #id homes.dummy run data get storage homes:storage players[-1].homes[-1].id
execute unless score #remaining homes.dummy matches 0 unless score #id homes.dummy = #home homes.dummy run function homes:rotate/home