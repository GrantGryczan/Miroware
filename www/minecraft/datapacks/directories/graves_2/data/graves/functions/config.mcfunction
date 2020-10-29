tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
tellraw @s ["                        Graves",{"text":" / ","color":"gray"},"Global Settings                        "]
tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
execute if score #robbing graves.config matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function graves:config/disable_robbing"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to disable ","color":"red"},"Grave Robbing",{"text":".","color":"red"},{"text":"\nWhen enabled, players can open graves they do not own.","color":"gray"},{"text":"\nDefault: Disabled","color":"dark_gray"}]}}," Grave Robbing"]
execute unless score #robbing graves.config matches 1 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function graves:config/enable_robbing"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enable ","color":"green"},"Grave Robbing",{"text":".","color":"green"},{"text":"\nWhen enabled, players can open graves they do not own.","color":"gray"},{"text":"\nDefault: Disabled","color":"dark_gray"}]}}," Grave Robbing"]
execute if score #xp graves.config matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function graves:config/disable_xp"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to disable ","color":"red"},"XP Collection",{"text":".","color":"red"},{"text":"\nWhen enabled, graves collect XP dropped on death.\nNote that players do not drop all their XP on death.","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," XP Collection"]
execute unless score #xp graves.config matches 1 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function graves:config/enable_xp"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enable ","color":"green"},"XP Collection",{"text":".","color":"green"},{"text":"\nWhen enabled, graves collect XP dropped on death.\nNote that players do not drop all their XP on death.","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," XP Collection"]
execute if score #locating graves.config matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function graves:config/disable_locating"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to disable ","color":"red"},"Grave Locating",{"text":".","color":"red"},{"text":"\nWhen enabled, players can see the coordinates of their last grave.","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," Grave Locating"]
execute unless score #locating graves.config matches 1 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function graves:config/enable_locating"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enable ","color":"green"},"Grave Locating",{"text":".","color":"green"},{"text":"\nWhen enabled, players can see the coordinates of their last grave.","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," Grave Locating"]
tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #despawn graves.config "},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enter the number of seconds it takes for a grave to despawn after it is created.\nEnter ","color":"gray"},"0",{"text":" to disable grave despawning.\nItems normally take 300 seconds (5 minutes) to despawn.","color":"gray"},{"text":"\nAccepts: whole numbers 0+\nDefault: 0","color":"dark_gray"}]}}," Grave Despawn Time ",{"text":"(Current: ","color":"gray"},{"score":{"name":"#despawn","objective":"graves.config"},"color":"gray"},{"text":")","color":"gray"}]
tellraw @s ["",{"text":">> ","color":"gold"},{"text":"[ Receive Grave Key ]","clickEvent":{"action":"run_command","value":"/function graves:give_grave_key"},"hoverEvent":{"action":"show_text","contents":{"text":"Click to receive a grave key which can be used to forcibly open graves.","color":"gray"}}}]
tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
execute store result score #sendCommandFeedback graves.config run gamerule sendCommandFeedback
execute if score #sendCommandFeedback graves.config matches 1 run function graves:hide_command_feedback