tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
tellraw @s ["                     Custom Nether Portals",{"text":" / ","color":"gray"},"Info                     "]
tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
tellraw @s ["",{"text":">>","color":"gold"}," Nether portal frames must use at least ",{"score":{"name":"#minSize","objective":"cusNetPor.config"}}," and at most ",{"score":{"name":"#maxSize","objective":"cusNetPor.config"}}," obsidian blocks."]
execute if score #nonRectangular cusNetPor.config matches 1 run tellraw @s ["",{"text":">>","color":"gold"}," Nether portal frames ",{"text":"can","color":"green"}," have non-rectangular shapes."]
execute unless score #nonRectangular cusNetPor.config matches 1 run tellraw @s ["",{"text":">>","color":"gold"}," Nether portal frames ",{"text":"cannot","color":"red"}," have non-rectangular shapes."]
tellraw @s {"text":"                                                                                ","color":"dark_gray","strikethrough":true}
scoreboard players set @s cusNetPor 0
scoreboard players enable @s cusNetPor