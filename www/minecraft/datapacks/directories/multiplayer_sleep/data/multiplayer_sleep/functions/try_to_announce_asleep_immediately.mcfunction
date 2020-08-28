execute store result score #asleep mpSleep.dummy if entity @a[tag=mpSleep.sleeping,scores={mpSleep.sleep=2..}]
execute as @a[tag=mpSleep.sleeping,scores={mpSleep.sleep=1}] run function multiplayer_sleep:announce_asleep
execute store result score #asleep mpSleep.dummy if entity @a[tag=mpSleep.sleeping,scores={mpSleep.sleep=100..}]