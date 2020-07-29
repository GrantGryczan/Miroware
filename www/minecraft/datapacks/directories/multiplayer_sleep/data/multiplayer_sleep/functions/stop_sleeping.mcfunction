function multiplayer_sleep:reset_progress
scoreboard players set #sleeping mulSle.dummy 0
scoreboard players set #remaining mulSle.dummy 24000
execute store result score #time mulSle.dummy run time query daytime
scoreboard players operation #remaining mulSle.dummy -= #time mulSle.dummy
execute if score #remaining mulSle.dummy >= #bit14 mulSle.dummy run function multiplayer_sleep:add_time/bit_14
execute if score #remaining mulSle.dummy >= #bit13 mulSle.dummy run function multiplayer_sleep:add_time/bit_13
execute if score #remaining mulSle.dummy >= #bit12 mulSle.dummy run function multiplayer_sleep:add_time/bit_12
execute if score #remaining mulSle.dummy >= #bit11 mulSle.dummy run function multiplayer_sleep:add_time/bit_11
execute if score #remaining mulSle.dummy >= #bit10 mulSle.dummy run function multiplayer_sleep:add_time/bit_10
execute if score #remaining mulSle.dummy >= #bit9 mulSle.dummy run function multiplayer_sleep:add_time/bit_9
execute if score #remaining mulSle.dummy >= #bit8 mulSle.dummy run function multiplayer_sleep:add_time/bit_8
execute if score #remaining mulSle.dummy >= #bit7 mulSle.dummy run function multiplayer_sleep:add_time/bit_7
execute if score #remaining mulSle.dummy >= #bit6 mulSle.dummy run function multiplayer_sleep:add_time/bit_6
execute if score #remaining mulSle.dummy >= #bit5 mulSle.dummy run function multiplayer_sleep:add_time/bit_5
execute if score #remaining mulSle.dummy >= #bit4 mulSle.dummy run function multiplayer_sleep:add_time/bit_4
execute if score #remaining mulSle.dummy >= #bit3 mulSle.dummy run function multiplayer_sleep:add_time/bit_3
execute if score #remaining mulSle.dummy >= #bit2 mulSle.dummy run function multiplayer_sleep:add_time/bit_2
execute if score #remaining mulSle.dummy >= #bit1 mulSle.dummy run function multiplayer_sleep:add_time/bit_1
execute if score #remaining mulSle.dummy >= #bit0 mulSle.dummy run function multiplayer_sleep:add_time/bit_0
execute if predicate multiplayer_sleep:raining run weather rain 1
execute if predicate multiplayer_sleep:thundering run weather thunder 1