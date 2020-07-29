scoreboard objectives add nevTooExp.config dummy "Never Too Expensive Config"
scoreboard objectives add nevTooExp trigger "Never Too Expensive"
scoreboard objectives add nevTooExp.count dummy
scoreboard objectives add nevTooExp.cost dummy
execute unless score #bottles nevTooExp.config matches 1.. run scoreboard players set #bottles nevTooExp.config 1
execute unless score #levels nevTooExp.config matches 1.. run scoreboard players set #levels nevTooExp.config 40