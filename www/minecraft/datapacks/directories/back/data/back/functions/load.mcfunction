scoreboard objectives add back trigger "Back"
scoreboard objectives add back.delay dummy
scoreboard objectives add back.dummy dummy
scoreboard objectives add back.config dummy "Back Config"
scoreboard objectives add back.x dummy
scoreboard objectives add back.y dummy
scoreboard objectives add back.z dummy
execute unless score #delay back.config matches 0.. run scoreboard players set #delay back.config 0