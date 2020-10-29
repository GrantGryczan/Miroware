scoreboard objectives add sethome trigger "Set Home"
scoreboard objectives add homes trigger "Homes"
scoreboard objectives add home trigger "Home"
scoreboard objectives add namehome trigger "Name Home"
scoreboard objectives add delhome trigger "Delete Home"
scoreboard objectives add homes.target dummy
scoreboard objectives add homes.delay dummy
scoreboard objectives add homes.cooldown dummy
scoreboard objectives add homes.dummy dummy
scoreboard objectives add homes.config dummy "Homes Config"
scoreboard objectives add homes.x dummy
scoreboard objectives add homes.y dummy
scoreboard objectives add homes.z dummy
scoreboard objectives add homes.limit dummy "Max Home Limit"
execute unless score #limit homes.config matches 0.. run scoreboard players set #limit homes.config 1
execute unless score #delay homes.config matches 0.. run scoreboard players set #delay homes.config 0
execute unless score #cooldown homes.config matches 0.. run scoreboard players set #cooldown homes.config 0