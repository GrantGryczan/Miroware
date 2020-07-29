data modify storage graves:storage temp set from entity @s UUIDMost
execute store success score #success graves.dummy run data modify storage graves:storage temp set from entity @e[type=minecraft:armor_stand,tag=graves.activated,limit=1] HandItems[1].tag.gravesData.uuidMost
execute if score #success graves.dummy matches 0 run function graves:check_uuid_least
execute if score #success graves.dummy matches 1 run function graves:fail_robbing