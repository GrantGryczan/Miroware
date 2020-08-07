scoreboard players operation #total mulSle.dummy *= #percent mulSle.config
scoreboard players operation #total mulSle.dummy /= #total mulSle.config
execute if score #total mulSle.dummy matches 0 run scoreboard players set #total mulSle.dummy 1
scoreboard players reset @a[tag=!mulSle.sleeping] mulSle.sleepTime
scoreboard players add @a[tag=mulSle.sleeping] mulSle.sleepTime 1
execute store result score #asleep mulSle.dummy if entity @a[tag=mulSle.sleeping,scores={mulSle.sleepTime=101..}]
execute if score #display mulSle.config matches 1 as @a[tag=mulSle.total] unless score @s mulSle.config matches 1.. run tag @s add mulSle.display1
execute if score #display mulSle.config matches 2 as @a[tag=mulSle.total] unless score @s mulSle.config matches 1.. run tag @s add mulSle.display2
execute if score #display mulSle.config matches 3 as @a[tag=mulSle.total] unless score @s mulSle.config matches 1.. run tag @s add mulSle.display3
tag @a[scores={mulSle.config=1}] add mulSle.display1
tag @a[scores={mulSle.config=2}] add mulSle.display2
tag @a[scores={mulSle.config=3}] add mulSle.display3
execute store result bossbar multiplayer_sleep:progress max run scoreboard players get #total mulSle.dummy
execute store result bossbar multiplayer_sleep:progress value run scoreboard players get #sleeping mulSle.dummy
bossbar set multiplayer_sleep:progress name [{"score":{"name":"#sleeping","objective":"mulSle.dummy"}}," of ",{"score":{"name":"#total","objective":"mulSle.dummy"}}," player(s) asleep"]
bossbar set multiplayer_sleep:progress players @a[tag=mulSle.display1]
bossbar set multiplayer_sleep:progress visible true
title @a[tag=mulSle.display2] actionbar [{"score":{"name":"#sleeping","objective":"mulSle.dummy"},"color":"aqua"},{"text":" of ","color":"aqua"},{"score":{"name":"#total","objective":"mulSle.dummy"},"color":"aqua"},{"text":" player(s) asleep","color":"aqua"}]
execute as @a[tag=mulSle.sleeping,scores={mulSle.sleepTime=100}] run function multiplayer_sleep:announce_asleep
tag @a remove mulSle.display1
tag @a remove mulSle.display2
tag @a remove mulSle.display3
execute unless score #asleep mulSle.dummy < #total mulSle.dummy run function multiplayer_sleep:sufficient_sleeping
tag @a remove mulSle.sleeping