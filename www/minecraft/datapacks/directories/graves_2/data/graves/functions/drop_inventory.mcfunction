execute store result score #xp graves.dummy run data get entity @s XpLevel
scoreboard players operation #xp graves.dummy *= #pointsPerLevel graves.dummy
execute if score #xp graves.dummy matches 101.. run scoreboard players set #xp graves.dummy 100
execute unless score #xp graves.config matches 1 if score #xp graves.dummy matches 1.. run function graves:drop_xp
execute if data entity @s Inventory[0] align xyz run function graves:create_grave
execute if score #xp graves.config matches 1 if score #xp graves.dummy matches 1.. align xyz run function graves:create_grave
xp set @s 0 levels
xp set @s 0 points