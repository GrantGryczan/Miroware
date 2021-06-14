tag @s[nbt={SelectedItem:{id:"minecraft:name_tag"}}] add homes.hasNameTag
execute if entity @s[tag=homes.hasNameTag] run function homes:try_to_name_home
tellraw @s[tag=!homes.hasNameTag] {"text":"You must be holding a name tag in your main hand to name a home.","color":"red"}
tag @s remove homes.hasNameTag
scoreboard players set @s namehome 0