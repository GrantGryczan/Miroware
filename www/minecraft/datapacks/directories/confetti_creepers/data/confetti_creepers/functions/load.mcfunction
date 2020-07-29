scoreboard objectives add conCre.config dummy "Confetti Creepers Config"
scoreboard objectives add conCre trigger "Confetti Creepers"
scoreboard objectives add conCre.dummy dummy
scoreboard players set #total conCre.config 100
execute unless score #chance conCre.config matches 0..100 run scoreboard players set #chance conCre.config 100