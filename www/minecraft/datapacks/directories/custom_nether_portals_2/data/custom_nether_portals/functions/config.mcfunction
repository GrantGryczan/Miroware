tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
tellraw @s ["               Custom Nether Portals",{"text":" / ","color":"gray"},"Global Settings               "]
tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
execute if score #nonRectangular cusNetPor.config matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function custom_nether_portals:config/disable_non_rectangular"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to disable ","color":"red"},"Non-Rectangular Frames",{"text":".","color":"red"},{"text":"\nWhen enabled, nether portal frames can have non-rectangular shapes.","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," Non-Rectangular Frames"]
execute unless score #nonRectangular cusNetPor.config matches 1 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function custom_nether_portals:config/enable_non_rectangular"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enable ","color":"green"},"Non-Rectangular Frames",{"text":".","color":"green"},{"text":"\nWhen enabled, nether portal frames can have non-rectangular shapes.","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," Non-Rectangular Frames"]
execute if score #cryingObsidian cusNetPor.config matches 1 run tellraw @s ["",{"text":"[ ✔ ]","color":"green","clickEvent":{"action":"run_command","value":"/function custom_nether_portals:config/disable_crying_obsidian"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to disable ","color":"red"},"Crying Obsidian",{"text":".","color":"red"},{"text":"\nWhen enabled, nether portal frames can use crying obsidian.","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," Crying Obsidian"]
execute unless score #cryingObsidian cusNetPor.config matches 1 run tellraw @s ["",{"text":"[ ❌ ]","color":"red","clickEvent":{"action":"run_command","value":"/function custom_nether_portals:config/enable_crying_obsidian"},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enable ","color":"green"},"Crying Obsidian",{"text":".","color":"green"},{"text":"\nWhen enabled, nether portal frames can use crying obsidian.","color":"gray"},{"text":"\nDefault: Enabled","color":"dark_gray"}]}}," Crying Obsidian"]
tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #minSize cusNetPor.config "},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enter the minimum number of obsidian blocks a nether portal frame can have.","color":"gray"},{"text":"\nAccepts: whole numbers 4-10\nDefault: 10","color":"dark_gray"}]}}," Min Frame Size",{"text":" (Current: ","color":"gray"},{"score":{"name":"#minSize","objective":"cusNetPor.config"},"color":"gray"},{"text":")","color":"gray"}]
tellraw @s ["",{"text":"[ ✎ ]","color":"gray","clickEvent":{"action":"suggest_command","value":"/scoreboard players set #maxSize cusNetPor.config "},"hoverEvent":{"action":"show_text","contents":["",{"text":"Click to enter the maximum number of obsidian blocks a nether portal frame can have.","color":"gray"},{"text":"\nIncreasing this may lead to large portals not being broken properly.","color":"red"},{"text":"\nAccepts: whole numbers 84+\nDefault: 84","color":"dark_gray"}]}}," Max Frame Size",{"text":" (Current: ","color":"gray"},{"score":{"name":"#maxSize","objective":"cusNetPor.config"},"color":"gray"},{"text":")","color":"gray"}]
tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
execute store result score #sendCommandFeedback cusNetPor.dummy run gamerule sendCommandFeedback
execute if score #sendCommandFeedback cusNetPor.dummy matches 1 run function custom_nether_portals:hide_command_feedback