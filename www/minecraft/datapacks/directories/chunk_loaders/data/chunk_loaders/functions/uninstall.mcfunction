scoreboard objectives remove chuLoa.dummy
schedule clear chunk_loaders:tick
schedule clear chunk_loaders:schedule
execute as @e[type=minecraft:item_frame,tag=chuLoa.marker] at @s run function chunk_loaders:destroy_chunk_loader