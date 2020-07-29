clock 1t {
	name tick
	execute at @e[type=minecraft:end_crystal] if block ~ ~-1 ~ minecraft:respawn_anchor if block ~ ~-2 ~ minecraft:crying_obsidian run setblock ~ ~-1 ~ minecraft:respawn_anchor[charges=4]
}
