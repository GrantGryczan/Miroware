execute store result score #value spawn.dummy run data get entity @s Pos[0] 10
execute if score #value spawn.dummy = @s spawn.x run function spawn:check_z