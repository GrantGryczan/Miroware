execute if data entity @s SelectedItem.tag.display.Name run tag @s add homes.nameTagSet
execute if data storage homes:storage players[-1].homes[-1].name run tag @s add homes.nameSet
execute if entity @s[tag=homes.nameTagSet] run function homes:try_to_set_home_name
execute unless entity @s[tag=homes.nameTagSet] run function homes:try_to_reset_home_name
tag @s remove homes.nameSet
tag @s remove homes.nameTagSet