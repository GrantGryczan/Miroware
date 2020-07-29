execute as @a unless score @s tpa.pid matches 1.. store result score @s tpa.pid run scoreboard players add #last tpa.pid 1
scoreboard players add @a[scores={tpa.target=1..}] tpa.time 1
execute as @a[scores={tpa.time=6000..}] run function tpa:time_out_tpa
execute as @a[scores={tpa=1..}] run function tpa:try_tpa
scoreboard players enable @a tpa
scoreboard players set @a tpa 0
execute as @a[scores={tpcancel=1}] run function tpa:try_tpcancel
scoreboard players enable @a tpcancel
scoreboard players set @a tpcancel 0
execute as @a[scores={tpaccept=0..}] run function tpa:try_tpaccept
scoreboard players enable @a tpaccept
scoreboard players set @a tpaccept -1
execute as @a[scores={tpdeny=0..}] run function tpa:try_tpdeny
scoreboard players enable @a tpdeny
scoreboard players set @a tpdeny -1
schedule function tpa:tick 1t