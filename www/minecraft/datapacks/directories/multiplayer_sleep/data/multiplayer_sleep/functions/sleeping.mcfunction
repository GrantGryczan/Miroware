scoreboard players operation #total mpSleep.dummy *= #percent mpSleep.config
scoreboard players operation #total mpSleep.dummy /= #total mpSleep.config
execute if score #total mpSleep.dummy matches 0 run scoreboard players set #total mpSleep.dummy 1
scoreboard players reset @a[tag=!mpSleep.sleeping] mpSleep.sleep
scoreboard players add @a[tag=mpSleep.sleeping] mpSleep.sleep 1
execute store result score #asleep mpSleep.dummy if entity @a[tag=mpSleep.sleeping,scores={mpSleep.sleep=101..}]
execute if score #display mpSleep.config matches 1 as @a[tag=mpSleep.total] unless score @s mpSleep.config matches 1.. run tag @s add mpSleep.display1
execute if score #display mpSleep.config matches 2 as @a[tag=mpSleep.total] unless score @s mpSleep.config matches 1.. run tag @s add mpSleep.display2
execute if score #display mpSleep.config matches 3 as @a[tag=mpSleep.total] unless score @s mpSleep.config matches 1.. run tag @s add mpSleep.display3
tag @a[scores={mpSleep.config=1}] add mpSleep.display1
tag @a[scores={mpSleep.config=2}] add mpSleep.display2
tag @a[scores={mpSleep.config=3}] add mpSleep.display3
execute store result bossbar multiplayer_sleep:progress max run scoreboard players get #total mpSleep.dummy
execute store result bossbar multiplayer_sleep:progress value run scoreboard players get #sleeping mpSleep.dummy
bossbar set multiplayer_sleep:progress name [{"score":{"name":"#sleeping","objective":"mpSleep.dummy"}}," of ",{"score":{"name":"#total","objective":"mpSleep.dummy"}}," player(s) asleep"]
bossbar set multiplayer_sleep:progress players @a[tag=mpSleep.display1]
bossbar set multiplayer_sleep:progress visible true
title @a[tag=mpSleep.display2] actionbar [{"score":{"name":"#sleeping","objective":"mpSleep.dummy"},"color":"aqua"},{"text":" of ","color":"aqua"},{"score":{"name":"#total","objective":"mpSleep.dummy"},"color":"aqua"},{"text":" player(s) asleep","color":"aqua"}]
execute as @a[tag=mpSleep.sleeping,scores={mpSleep.sleep=100}] run function multiplayer_sleep:announce_asleep
tag @a remove mpSleep.display1
tag @a remove mpSleep.display2
tag @a remove mpSleep.display3
execute unless score #asleep mpSleep.dummy < #total mpSleep.dummy run function multiplayer_sleep:sufficient_sleeping
tag @a remove mpSleep.sleeping