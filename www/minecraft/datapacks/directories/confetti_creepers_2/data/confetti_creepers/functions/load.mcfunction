scoreboard objectives add cftCreep.config dummy "Confetti Creepers Config"
scoreboard objectives add cftCreep trigger "Confetti Creepers"
scoreboard players set #total cftCreep.config 100
execute unless score #chance cftCreep.config matches 0..100 run scoreboard players set #chance cftCreep.config 100