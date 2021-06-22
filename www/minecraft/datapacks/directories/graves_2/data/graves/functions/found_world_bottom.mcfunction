scoreboard players set #foundBottom graves.dummy 1
scoreboard players operation #bottomY graves.dummy = #y graves.dummy
execute if score #graveY graves.dummy <= #y graves.dummy run function graves:clamp_grave_to_world_bottom
execute if score #graveY graves.dummy > #y graves.dummy positioned ~ ~16 ~ run function graves:check_for_world_top