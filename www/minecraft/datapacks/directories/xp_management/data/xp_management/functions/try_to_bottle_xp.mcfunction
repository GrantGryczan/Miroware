advancement revoke @s only xp_management:try_to_bottle_xp
tag @s add craXPBot.continue
execute store result score #points craXPBot.dummy run xp query @s points
execute if score #points craXPBot.dummy matches ..4 if entity @s[level=1] run tag @s remove craXPBot.continue
execute if entity @s[tag=craXPBot.continue] run function xp_management:bottle_xp