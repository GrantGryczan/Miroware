execute if score #display mpSleep.config matches 0 run tellraw @s ["",{"text":"[ ✔ ]","color":"green"}," Display: Default (Hidden)"]
execute if score #display mpSleep.config matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green"}," Display: Default (Boss Bar)"]
execute if score #display mpSleep.config matches 2 run tellraw @s ["",{"text":"[ ✔ ]","color":"green"}," Display: Default (Action Bar)"]
execute if score #display mpSleep.config matches 3 run tellraw @s ["",{"text":"[ ✔ ]","color":"green"}," Display: Default (Chat)"]