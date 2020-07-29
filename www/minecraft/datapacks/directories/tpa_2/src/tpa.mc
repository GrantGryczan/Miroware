function load {
	scoreboard objectives add tpa.pid dummy "Player ID"
	scoreboard objectives setdisplay list tpa.pid
	scoreboard objectives add tpa.target dummy
	scoreboard objectives add tpa.time dummy
	scoreboard objectives add tpa trigger
	scoreboard objectives add tpcancel trigger
	scoreboard objectives add tpaccept trigger
	scoreboard objectives add tpdeny trigger
}
function uninstall {
	scoreboard objectives remove tpa.pid
	scoreboard objectives remove tpa.target
	scoreboard objectives remove tpa.time
	scoreboard objectives remove tpa
	scoreboard objectives remove tpcancel
	scoreboard objectives remove tpaccept
	scoreboard objectives remove tpdeny
	schedule clear tpa:tick
}
clock 1t {
	name tick
	execute as @a unless score @s tpa.pid matches 1.. store result score @s tpa.pid run scoreboard players add #last tpa.pid 1
	scoreboard players add @a[scores={tpa.target=1..}] tpa.time 1
	execute as @a[scores={tpa.time=6000..}] run function tpa:time_out_tpa
	execute as @a[scores={tpa=1..}] run function tpa:try_tpa
	scoreboard players enable @a tpa
	scoreboard players set @a tpa 0
	execute as @a[scores={tpcancel=1}] run function tpa:try_tpcancel
	scoreboard players enable @a tpcancel
	scoreboard players set @a tpcancel 0
	execute as @a[scores={tpaccept=0..}] run function tpa:try_tpaccept
	scoreboard players enable @a tpaccept
	scoreboard players set @a tpaccept -1
	execute as @a[scores={tpdeny=0..}] run function tpa:try_tpdeny
	scoreboard players enable @a tpdeny
	scoreboard players set @a tpdeny -1
}
function untag_older_senders {
	tag @s add tpa.self
	execute as @a[tag=tpa.sender] if score @s tpa.time > @a[tag=tpa.self,limit=1] tpa.time run tag @s remove tpa.sender
	tag @s remove tpa.self
}
function try_tpdeny {
	tag @s add tpa.target
	execute as @a if score @s tpa.target = @a[tag=tpa.target,limit=1] tpa.pid run tag @s add tpa.sender
	execute unless score @s tpdeny matches 0 as @a unless score @s tpa.pid = @a[tag=tpa.target,limit=1] tpdeny run tag @s remove tpa.sender
	execute unless score @s tpdeny matches 0 unless entity @a[tag=tpa.sender] run tellraw @s [{"text":"You have no active teleport requests from a player with PID ","color":"red"},{"score":{"name":"@s","objective":"tpdeny"},"color":"red"},{"text":" to deny.","color":"red"}]
	execute if score @s tpdeny matches 0 unless entity @a[tag=tpa.sender] run tellraw @s {"text":"You have no active teleport requests to deny.","color":"red"}
	execute if score @s tpdeny matches 0 as @a[tag=tpa.sender] run function tpa:untag_older_senders
	execute as @a[tag=tpa.sender] run function tpa:deny_tpa
	tag @s remove tpa.target
}
function try_tpcancel {
	execute unless score @s tpa.target matches 1.. run tellraw @s {"text":"You have no active teleport requests to cancel.","color":"red"}
	execute if score @s tpa.target matches 1.. run function tpa:cancel_tpa
}
function try_tpaccept {
	tag @s add tpa.target
	execute as @a if score @s tpa.target = @a[tag=tpa.target,limit=1] tpa.pid run tag @s add tpa.sender
	execute unless score @s tpaccept matches 0 as @a unless score @s tpa.pid = @a[tag=tpa.target,limit=1] tpaccept run tag @s remove tpa.sender
	execute unless score @s tpaccept matches 0 unless entity @a[tag=tpa.sender] run tellraw @s [{"text":"You have no active teleport requests from a player with PID ","color":"red"},{"score":{"name":"@s","objective":"tpaccept"},"color":"red"},{"text":" to accept.","color":"red"}]
	execute if score @s tpaccept matches 0 unless entity @a[tag=tpa.sender] run tellraw @s {"text":"You have no active teleport requests to accept.","color":"red"}
	execute if score @s tpaccept matches 0 as @a[tag=tpa.sender] run function tpa:untag_older_senders
	execute as @a[tag=tpa.sender] run function tpa:accept_tpa
	tag @s remove tpa.target
}
function try_tpa {
	tag @s add tpa.sender
	execute as @a if score @s tpa.pid = @a[tag=tpa.sender,limit=1] tpa run tag @s add tpa.target
	execute unless entity @a[tag=tpa.target] run tellraw @s [{"text":"No player with PID ","color":"red"},{"score":{"name":"@s","objective":"tpa"},"color":"red"},{"text":" was found.","color":"red"}]
	execute if entity @s[tag=tpa.target] run tellraw @s {"text":"You cannot send a teleport request to yourself.","color":"red"}
	execute as @a[tag=!tpa.sender,tag=tpa.target,limit=1] run function tpa:receive_tpa
	tag @s remove tpa.sender
	tag @a[tag=tpa.target] remove tpa.target
}
function time_out_tpa {
	tag @s add tpa.sender
	tellraw @s {"text":"Your teleport request has timed out after five minutes.","color":"red"}
	execute as @a if score @s tpa.pid = @a[tag=tpa.sender,limit=1] tpa.target run tellraw @s ["",{"selector":"@a[tag=tpa.sender]","color":"red"},{"text":"'s teleport request has timed out after five minutes.","color":"red"}]
	scoreboard players set @s tpa.target 0
	scoreboard players set @s tpa.time 0
	tag @s remove tpa.sender
}
function receive_tpa {
	execute as @a[tag=tpa.sender] if score @s tpa.target matches 1.. run function tpa:cancel_tpa
	scoreboard players operation @a[tag=tpa.sender] tpa.target = @a[tag=tpa.sender] tpa
	tellraw @a[tag=tpa.sender] [{"text":"You have requested to teleport to ","color":"dark_aqua"},{"selector":"@s","color":"aqua"},{"text":".\nTo cancel, ","color":"dark_aqua"},{"text":"enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/trigger tpcancel","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger tpcancel"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/trigger tpcancel","color":"aqua"},{"text":".","color":"dark_aqua"}]}},{"text":".","color":"dark_aqua"}]
	tellraw @s ["",{"selector":"@a[tag=tpa.sender]","color":"aqua"},{"text":" has requested to teleport to you.\nTo accept, ","color":"dark_aqua"},{"text":"enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/trigger tpaccept","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger tpaccept"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/trigger tpaccept","color":"aqua"},{"text":".\nThe ","color":"dark_aqua"},{"text":"most recent","color":"red"},{"text":" active teleport request will be accepted.\nEnter ","color":"dark_aqua"},{"text":"/trigger tpaccept set <PID>","color":"aqua"},{"text":" instead if this player's request is not the most recent.","color":"dark_aqua"}]}},{"text":".\nTo deny, ","color":"dark_aqua"},{"text":"enter","color":"gold"},{"text":" or ","color":"dark_aqua"},{"text":"click","color":"gold"},{"text":" on ","color":"dark_aqua"},{"text":"/trigger tpdeny","color":"aqua","clickEvent":{"action":"run_command","value":"/trigger tpdeny"},"hoverEvent":{"action":"show_text","contents":[{"text":"Click to run ","color":"dark_aqua"},{"text":"/trigger tpdeny","color":"aqua"},{"text":".\nThe ","color":"dark_aqua"},{"text":"most recent","color":"red"},{"text":" active teleport request will be denied.\nEnter ","color":"dark_aqua"},{"text":"/trigger tpdeny set <PID>","color":"aqua"},{"text":" instead if this player's request is not the most recent.","color":"dark_aqua"}]}},{"text":".","color":"dark_aqua"}]
}
function deny_tpa {
	tellraw @a[tag=tpa.target] [{"text":"You have denied ","color":"dark_aqua"},{"selector":"@s","color":"aqua"},{"text":"'s teleport request.","color":"dark_aqua"}]
	tellraw @s ["",{"selector":"@a[tag=tpa.target]","color":"red"},{"text":" has denied your teleport request.","color":"red"}]
	scoreboard players set @s tpa.target 0
	scoreboard players set @s tpa.time 0
	tag @s remove tpa.sender
}
function cancel_tpa {
	tag @s add tpa.cancelSender
	execute if entity @s[tag=tpa.sender] run tellraw @s {"text":"You have cancelled your previous teleport request.","color":"red"}
	execute unless entity @s[tag=tpa.sender] run tellraw @s {"text":"You have cancelled your teleport request.","color":"dark_aqua"}
	execute as @a if score @s tpa.pid = @a[tag=tpa.cancelSender,limit=1] tpa.target run tellraw @s ["",{"selector":"@a[tag=tpa.cancelSender]","color":"red"},{"text":" has cancelled their teleport request.","color":"red"}]
	scoreboard players set @s tpa.target 0
	scoreboard players set @s tpa.time 0
	tag @s remove tpa.cancelSender
}
function accept_tpa {
	tellraw @a[tag=tpa.target] [{"text":"You have accepted ","color":"dark_aqua"},{"selector":"@s","color":"aqua"},{"text":"'s teleport request.","color":"dark_aqua"}]
	tellraw @s ["",{"selector":"@a[tag=tpa.target]","color":"aqua"},{"text":" has accepted your teleport request.","color":"dark_aqua"}]
	execute at @s run function back:set_back
	tp @s @a[tag=tpa.target,limit=1]
	scoreboard players set @s tpa.target 0
	scoreboard players set @s tpa.time 0
	tag @s remove tpa.sender
}
