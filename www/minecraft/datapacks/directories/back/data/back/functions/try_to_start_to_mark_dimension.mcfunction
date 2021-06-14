execute store success score #success back.dummy run forceload add ~ ~
execute if score #success back.dummy matches 1 run function back:start_to_mark_dimension
execute unless score #success back.dummy matches 1 run function back:check_chunk_fully_loaded