execute unless score #cooldown spawn.config matches 0 run scoreboard players operation @s spawn.cooldown = #cooldown spawn.config
execute at @s run function back:set_back
summon minecraft:marker ~ ~ ~ {Tags:["spawn.start"]}
function spawn:offset_up
execute if block ~ ~ ~ #spawn:valid_spawn_location run function spawn:offset_down
kill @e[type=minecraft:marker,tag=spawn.start]