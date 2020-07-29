scoreboard objectives remove graves.config
scoreboard objectives remove graves.deaths
scoreboard objectives remove graves.id
scoreboard objectives remove graves.sneak
scoreboard objectives remove graves.dummy
scoreboard objectives remove grave
data remove storage graves:storage players
data remove storage graves:storage lastGrave
data remove storage graves:storage temp
execute in minecraft:overworld run gamerule keepInventory false
execute in minecraft:the_nether run gamerule keepInventory false
execute in minecraft:the_end run gamerule keepInventory false
schedule clear graves:tick
schedule clear graves:update_model
schedule clear graves:check_game_rules