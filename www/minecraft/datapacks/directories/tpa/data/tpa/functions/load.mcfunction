scoreboard objectives add tpa.config dummy "TPA Config"
scoreboard objectives add tpa.pid dummy "Player ID"
scoreboard objectives setdisplay list tpa.pid
scoreboard objectives add tpa.target dummy
scoreboard objectives add tpa.timeout dummy
scoreboard objectives add tpa.cooldown dummy
scoreboard objectives add tpa trigger
scoreboard objectives add tpcancel trigger
scoreboard objectives add tpaccept trigger
scoreboard objectives add tpdeny trigger
execute unless score #cooldown tpa.config matches 0.. run scoreboard players set #cooldown tpa.config 0