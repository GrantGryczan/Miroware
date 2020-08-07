function multiplayer_sleep:reset_progress
scoreboard players set #sleeping mulSle.dummy 0
scoreboard players set #remaining mulSle.dummy 24000
execute store result score #time mulSle.dummy run time query daytime
scoreboard players operation #remaining mulSle.dummy -= #time mulSle.dummy
execute if score #remaining mulSle.dummy matches 16384.. run function multiplayer_sleep:add_time/bit_14
execute if score #remaining mulSle.dummy matches 8192.. run function multiplayer_sleep:add_time/bit_13
execute if score #remaining mulSle.dummy matches 4096.. run function multiplayer_sleep:add_time/bit_12
execute if score #remaining mulSle.dummy matches 2048.. run function multiplayer_sleep:add_time/bit_11
execute if score #remaining mulSle.dummy matches 1024.. run function multiplayer_sleep:add_time/bit_10
execute if score #remaining mulSle.dummy matches 512.. run function multiplayer_sleep:add_time/bit_9
execute if score #remaining mulSle.dummy matches 256.. run function multiplayer_sleep:add_time/bit_8
execute if score #remaining mulSle.dummy matches 128.. run function multiplayer_sleep:add_time/bit_7
execute if score #remaining mulSle.dummy matches 64.. run function multiplayer_sleep:add_time/bit_6
execute if score #remaining mulSle.dummy matches 32.. run function multiplayer_sleep:add_time/bit_5
execute if score #remaining mulSle.dummy matches 16.. run function multiplayer_sleep:add_time/bit_4
execute if score #remaining mulSle.dummy matches 8.. run function multiplayer_sleep:add_time/bit_3
execute if score #remaining mulSle.dummy matches 4.. run function multiplayer_sleep:add_time/bit_2
execute if score #remaining mulSle.dummy matches 2.. run function multiplayer_sleep:add_time/bit_1
execute if score #remaining mulSle.dummy matches 1.. run function multiplayer_sleep:add_time/bit_0
execute if predicate multiplayer_sleep:raining run weather rain 1
execute if predicate multiplayer_sleep:thundering run weather thunder 1