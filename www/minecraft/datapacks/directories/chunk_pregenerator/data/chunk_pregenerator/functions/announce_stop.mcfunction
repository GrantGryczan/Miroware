tellraw @a {"text":"Chunks pre-generated!","color":"gold"}
tellraw @a {"text":"If this is a multiplayer world, it is recommended that you restart the server to clear lag from the pre-generation.","color":"gold"}
tellraw @a {"text":"If this is a singleplayer world, it is recommended that you leave and rejoin to clear lag from the pre-generation.","color":"gold"}
execute unless entity @a run function chunk_pregenerator:log_completion