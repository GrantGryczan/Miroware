execute if entity @s[tag=homes.nameSet] run function homes:reset_home_name
tellraw @s[tag=!homes.nameSet] {"text":"You must rename the name tag to name your home.","color":"red"}