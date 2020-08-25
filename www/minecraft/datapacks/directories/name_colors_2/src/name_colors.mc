function load {
	scoreboard objectives add color trigger "Color"
	team add namCol.black "Black"
	team modify namCol.black color black
	team add namCol.dBlue "Dark Blue"
	team modify namCol.dBlue color dark_blue
	team add namCol.dGreen "Dark Green"
	team modify namCol.dGreen color dark_green
	team add namCol.dAqua "Dark Aqua"
	team modify namCol.dAqua color dark_aqua
	team add namCol.dRed "Dark Red"
	team modify namCol.dRed color dark_red
	team add namCol.dPurple "Dark Purple"
	team modify namCol.dPurple color dark_purple
	team add namCol.gold "Gold"
	team modify namCol.gold color gold
	team add namCol.gray "Gray"
	team modify namCol.gray color gray
	team add namCol.dGray "Dark Gray"
	team modify namCol.dGray color dark_gray
	team add namCol.blue "Blue"
	team modify namCol.blue color blue
	team add namCol.green "Green"
	team modify namCol.green color green
	team add namCol.aqua "Aqua"
	team modify namCol.aqua color aqua
	team add namCol.red "Red"
	team modify namCol.red color red
	team add namCol.lPurple "Light Purple"
	team modify namCol.lPurple color light_purple
	team add namCol.yellow "Yellow"
	team modify namCol.yellow color yellow
	team add namCol.white "White"
	team modify namCol.white color white
}
function uninstall {
	schedule clear name_colors:tick
	scoreboard objectives remove color
	team remove namCol.black
	team remove namCol.dBlue
	team remove namCol.dGreen
	team remove namCol.dAqua
	team remove namCol.dRed
	team remove namCol.dPurple
	team remove namCol.gold
	team remove namCol.gray
	team remove namCol.dGray
	team remove namCol.blue
	team remove namCol.green
	team remove namCol.aqua
	team remove namCol.red
	team remove namCol.lPurple
	team remove namCol.yellow
	team remove namCol.white
}
clock 1t {
	name tick
	execute as @a[scores={color=..-2}] run function name_colors:trigger
	execute as @a[scores={color=0..}] run function name_colors:trigger
	scoreboard players set @a color -1
	scoreboard players enable @a color
}
function trigger {
	execute as @s[scores={color=0}] run {
		name info
		tellraw @s [{"text":"Click a color to apply it to your username.\n","color":"COLOR_1"},{"text":"Black","color":"black","clickEvent":{"action":"run_command","value":"/trigger color set 1"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set 1","color":"COLOR_2"},{"text":".\nColor code: #000000","color":"COLOR_1"}]}},"  ",{"text":"Dark Blue","color":"dark_blue","clickEvent":{"action":"run_command","value":"/trigger color set 2"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set 2","color":"COLOR_2"},{"text":".\nColor code: #0000aa","color":"COLOR_1"}]}},"  ",{"text":"Dark Green","color":"dark_green","clickEvent":{"action":"run_command","value":"/trigger color set 3"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set 3","color":"COLOR_2"},{"text":".\nColor code: #00aa00","color":"COLOR_1"}]}},"  ",{"text":"Dark Aqua","color":"dark_aqua","clickEvent":{"action":"run_command","value":"/trigger color set 4"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set 4","color":"COLOR_2"},{"text":".\nColor code: #00aaaa","color":"COLOR_1"}]}},"\n",{"text":"Dark Red","color":"dark_red","clickEvent":{"action":"run_command","value":"/trigger color set 5"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set 5","color":"COLOR_2"},{"text":".\nColor code: #aa0000","color":"COLOR_1"}]}},"  ",{"text":"Dark Purple","color":"dark_purple","clickEvent":{"action":"run_command","value":"/trigger color set 6"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set 6","color":"COLOR_2"},{"text":".\nColor code: #aa00aa","color":"COLOR_1"}]}},"  ",{"text":"Gold","color":"gold","clickEvent":{"action":"run_command","value":"/trigger color set 7"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set 7","color":"COLOR_2"},{"text":".\nColor code: #ffaa00","color":"COLOR_1"}]}},"  ",{"text":"Gray","color":"gray","clickEvent":{"action":"run_command","value":"/trigger color set 8"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set 8","color":"COLOR_2"},{"text":".\nColor code: #aaaaaa","color":"COLOR_1"}]}},"\n",{"text":"Dark Gray","color":"dark_gray","clickEvent":{"action":"run_command","value":"/trigger color set 9"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set 9","color":"COLOR_2"},{"text":".\nColor code: #555555","color":"COLOR_1"}]}},"  ",{"text":"Blue","color":"blue","clickEvent":{"action":"run_command","value":"/trigger color set 10"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set 10","color":"COLOR_2"},{"text":".\nColor code: #5555ff","color":"COLOR_1"}]}},"  ",{"text":"Green","color":"green","clickEvent":{"action":"run_command","value":"/trigger color set 11"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set 11","color":"COLOR_2"},{"text":".\nColor code: #55ff55","color":"COLOR_1"}]}},"  ",{"text":"Aqua","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger color set 12"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set 12","color":"COLOR_2"},{"text":".\nColor code: #55ffff","color":"COLOR_1"}]}},"\n",{"text":"Red","color":"red","clickEvent":{"action":"run_command","value":"/trigger color set 13"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set 13","color":"COLOR_2"},{"text":".\nColor code: #ff5555","color":"COLOR_1"}]}},"  ",{"text":"Light Purple","color":"light_purple","clickEvent":{"action":"run_command","value":"/trigger color set 14"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set 14","color":"COLOR_2"},{"text":".\nColor code: #ff55ff","color":"COLOR_1"}]}},"  ",{"text":"Yellow","color":"yellow","clickEvent":{"action":"run_command","value":"/trigger color set 15"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set 15","color":"COLOR_2"},{"text":".\nColor code: #ffff55","color":"COLOR_1"}]}},"  ",{"text":"White","color":"white","clickEvent":{"action":"run_command","value":"/trigger color set 16"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set 16","color":"COLOR_2"},{"text":".\nColor code: #ffffff","color":"COLOR_1"}]}}]
		tellraw @s [{"text":"Click ","color":"COLOR_1"},{"text":"here","color":"COLOR_2","clickEvent":{"action":"run_command","value":"/trigger color set -2"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"COLOR_1"},{"text":"/trigger color set -2","color":"COLOR_2"},{"text":".","color":"COLOR_1"}]}},{"text":" to reset your color.","color":"COLOR_1"}]
	}
	team leave @s[scores={color=-2}]
	tellraw @s[scores={color=-2}] ["<",{"selector":"@s"},"> Your color has been reset. Only you can see this preview."]
	team join namCol.black @s[scores={color=1}]
	team join namCol.dBlue @s[scores={color=2}]
	team join namCol.dGreen @s[scores={color=3}]
	team join namCol.dAqua @s[scores={color=4}]
	team join namCol.dRed @s[scores={color=5}]
	team join namCol.dPurple @s[scores={color=6}]
	team join namCol.gold @s[scores={color=7}]
	team join namCol.gray @s[scores={color=8}]
	team join namCol.dGray @s[scores={color=9}]
	team join namCol.blue @s[scores={color=10}]
	team join namCol.green @s[scores={color=11}]
	team join namCol.aqua @s[scores={color=12}]
	team join namCol.red @s[scores={color=13}]
	team join namCol.lPurple @s[scores={color=14}]
	team join namCol.yellow @s[scores={color=15}]
	team join namCol.white @s[scores={color=16}]
	tellraw @s[scores={color=1..16}] ["<",{"selector":"@s"},"> Your color has been set. Only you can see this preview."]
}
