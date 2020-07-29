scoreboard objectives add cusNetPor trigger "Custom Nether Portals"
scoreboard objectives add cusNetPor.config dummy "Custom Nether Portals Config"
scoreboard objectives add cusNetPor.dummy dummy
scoreboard objectives add cusNetPor.useFAS minecraft.used:minecraft.flint_and_steel
scoreboard objectives add cusNetPor.useFC minecraft.used:minecraft.fire_charge
execute unless score #nonRectangular cusNetPor.config matches 0..1 run scoreboard players set #nonRectangular cusNetPor.config 1
execute unless score #minSize cusNetPor.config matches 0.. run scoreboard players set #minSize cusNetPor.config 10
execute unless score #maxSize cusNetPor.config matches 0.. run scoreboard players set #maxSize cusNetPor.config 84