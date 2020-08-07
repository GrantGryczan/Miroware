execute store result score #reducedDebugInfo homes.dummy run gamerule reducedDebugInfo
data modify storage homes:storage temp set from storage homes:storage players[-1].homes
execute store result score #remaining homes.dummy store result score #homes homes.dummy run data get storage homes:storage temp
function homes:list_home