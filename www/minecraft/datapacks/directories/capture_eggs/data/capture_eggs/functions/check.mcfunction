execute positioned ~-0.5 ~-0.5 ~-0.5 as @e[type=#capture_eggs:capturable,dx=0,dy=0,dz=0,sort=nearest,limit=1] at @s run function capture_eggs:capture
scoreboard players remove #steps capEgg.dummy 1
execute unless score #steps capEgg.dummy matches 0 positioned ^ ^ ^0.1 run function capture_eggs:check