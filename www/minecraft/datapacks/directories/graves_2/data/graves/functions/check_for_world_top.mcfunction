scoreboard players add #y graves.dummy 16
execute unless predicate graves:loaded run function graves:found_world_top
execute if score #foundTop graves.dummy matches 0 positioned ~ ~16 ~ run function graves:check_for_world_top