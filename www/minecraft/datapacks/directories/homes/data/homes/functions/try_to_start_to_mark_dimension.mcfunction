execute store success score #success homes.dummy run forceload add ~ ~
execute if score #success homes.dummy matches 1 run function homes:start_to_mark_dimension
execute unless score #success homes.dummy matches 1 run function homes:check_chunk_fully_loaded