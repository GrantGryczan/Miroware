execute store success score #success chuLoa.dummy run forceload add ~ ~
execute if score #success chuLoa.dummy matches 1 run function chunk_loaders:create_chunk_loader
execute unless score #success chuLoa.dummy matches 1 run data merge entity @s {CustomName:'{"text":"This chunk is already force-loaded.","color":"red"}',CustomNameVisible:1b}