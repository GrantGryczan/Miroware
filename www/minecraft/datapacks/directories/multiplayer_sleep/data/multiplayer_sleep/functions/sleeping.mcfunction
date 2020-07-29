scoreboard players operation #total mulSle.dummy *= #percent mulSle.config
scoreboard players operation #total mulSle.dummy /= #total mulSle.config
execute if score #total mulSle.dummy matches 0 run scoreboard players set #total mulSle.dummy 1
execute store result bossbar multiplayer_sleep:progress max run scoreboard players get #total mulSle.dummy
execute store result bossbar multiplayer_sleep:progress value run scoreboard players get #sleeping mulSle.dummy
bossbar set multiplayer_sleep:progress name [{"score":{"name":"#sleeping","objective":"mulSle.dummy"}}," of ",{"score":{"name":"#total","objective":"mulSle.dummy"}}," player(s) asleep"]
bossbar set multiplayer_sleep:progress players @a[tag=mulSle.total]
bossbar set multiplayer_sleep:progress visible true
execute if score #sleeping mulSle.dummy < #total mulSle.dummy run scoreboard players set #timer mulSle.dummy 0
execute unless score #sleeping mulSle.dummy < #total mulSle.dummy run function multiplayer_sleep:sufficient_sleeping
tag @a remove mulSle.sleeping