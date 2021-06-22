execute store result score #xp graves.dummy run data get entity @s XpLevel
scoreboard players operation #xp graves.dummy *= #pointsPerLevel graves.dummy
execute if score #xp graves.dummy matches 101.. run scoreboard players set #xp graves.dummy 100
scoreboard players set #deathMode graves.api -1
function #graves:handle_death
execute if score #deathMode graves.api matches -1 run function graves:try_to_create_grave