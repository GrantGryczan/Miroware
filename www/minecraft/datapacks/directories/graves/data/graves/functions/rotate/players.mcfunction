execute store result score #remaining graves.dummy run data get storage graves:storage players
data modify storage graves:storage temp set from entity @s UUIDMost
execute store success score #success graves.dummy run data modify storage graves:storage temp set from storage graves:storage players[-1].uuidMost
execute if score #success graves.dummy matches 0 run function graves:check_uuid_least_for_player_rotation
execute unless score #remaining graves.dummy matches 0 if score #success graves.dummy matches 1 run function graves:rotate/player
execute if score #remaining graves.dummy matches 0 run function graves:add_player