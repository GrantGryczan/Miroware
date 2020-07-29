scoreboard objectives add mulSle.config dummy "Multiplayer Sleep Config"
scoreboard objectives add mulSle trigger "Multiplayer Sleep"
scoreboard objectives add mulSle.dummy dummy
scoreboard players set #total mulSle.config 100
execute unless score #percent mulSle.config matches 0..100 run scoreboard players set #percent mulSle.config 50
scoreboard players set #bit0 mulSle.dummy 1
scoreboard players set #bit1 mulSle.dummy 2
scoreboard players set #bit2 mulSle.dummy 4
scoreboard players set #bit3 mulSle.dummy 8
scoreboard players set #bit4 mulSle.dummy 16
scoreboard players set #bit5 mulSle.dummy 32
scoreboard players set #bit6 mulSle.dummy 64
scoreboard players set #bit7 mulSle.dummy 128
scoreboard players set #bit8 mulSle.dummy 256
scoreboard players set #bit9 mulSle.dummy 512
scoreboard players set #bit10 mulSle.dummy 1024
scoreboard players set #bit11 mulSle.dummy 2048
scoreboard players set #bit12 mulSle.dummy 4096
scoreboard players set #bit13 mulSle.dummy 8192
scoreboard players set #bit14 mulSle.dummy 16384
bossbar add multiplayer_sleep:progress "Multiplayer Sleep Progress"