tag @s add cftCreep.done
execute store result score #value cftCreep.config run data get entity @s UUIDLeast 0.0000000001
scoreboard players operation #value cftCreep.config %= #total cftCreep.config
execute if score #value cftCreep.config < #chance cftCreep.config run function confetti_creepers:set_confetti