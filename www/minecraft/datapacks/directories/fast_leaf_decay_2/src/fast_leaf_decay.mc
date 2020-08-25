function load {
	scoreboard objectives add leafDec.dummy dummy
	scoreboard objectives add leafDec.oakL minecraft.mined:minecraft.oak_log
	scoreboard objectives add leafDec.spruceL minecraft.mined:minecraft.spruce_log
	scoreboard objectives add leafDec.birchL minecraft.mined:minecraft.birch_log
	scoreboard objectives add leafDec.jungleL minecraft.mined:minecraft.jungle_log
	scoreboard objectives add leafDec.acaciaL minecraft.mined:minecraft.acacia_log
	scoreboard objectives add leafDec.darkOakL minecraft.mined:minecraft.dark_oak_log
	scoreboard objectives add leafDec.oakS minecraft.mined:minecraft.oak_leaves
	scoreboard objectives add leafDec.spruceS minecraft.mined:minecraft.spruce_leaves
	scoreboard objectives add leafDec.birchS minecraft.mined:minecraft.birch_leaves
	scoreboard objectives add leafDec.jungleS minecraft.mined:minecraft.jungle_leaves
	scoreboard objectives add leafDec.acaciaS minecraft.mined:minecraft.acacia_leaves
	scoreboard objectives add leafDec.darkOakS minecraft.mined:minecraft.dark_oak_leaves
	scoreboard players reset * leafDec.oakL
	scoreboard players reset * leafDec.spruceL
	scoreboard players reset * leafDec.birchL
	scoreboard players reset * leafDec.jungleL
	scoreboard players reset * leafDec.acaciaL
	scoreboard players reset * leafDec.darkOakL
	scoreboard players reset * leafDec.oakS
	scoreboard players reset * leafDec.spruceS
	scoreboard players reset * leafDec.birchS
	scoreboard players reset * leafDec.jungleS
	scoreboard players reset * leafDec.acaciaS
	scoreboard players reset * leafDec.darkOakS
}
function uninstall {
	schedule clear fast_leaf_decay:tick
	scoreboard objectives remove leafDec.dummy
	scoreboard objectives remove leafDec.oakL
	scoreboard objectives remove leafDec.spruceL
	scoreboard objectives remove leafDec.birchL
	scoreboard objectives remove leafDec.jungleL
	scoreboard objectives remove leafDec.acaciaL
	scoreboard objectives remove leafDec.darkOakL
	scoreboard objectives remove leafDec.oakS
	scoreboard objectives remove leafDec.spruceS
	scoreboard objectives remove leafDec.birchS
	scoreboard objectives remove leafDec.jungleS
	scoreboard objectives remove leafDec.acaciaS
	scoreboard objectives remove leafDec.darkOakS
}
clock 1t {
	name tick
	execute as @e[type=minecraft:area_effect_cloud,tag=leafDec.marker] at @s run {
		name tick_marker
		scoreboard players set #continue leafDec.dummy 1
		execute unless block ~ ~ ~ #minecraft:leaves[persistent=false] run {
			name destroy_marker
			scoreboard players set #continue leafDec.dummy 0
			kill @s
		}
		execute if score #continue leafDec.dummy matches 1 run {
			name tick_marker_in_leaves
			tag @s remove leafDec.new
			scoreboard players add @s leafDec.dummy 1
			execute unless entity @s[tag=leafDec.front] run {
				name check_marker
				execute if block ~ ~ ~ #minecraft:leaves[distance=7] run {
					name tick_distant_marker
					tag @s add leafDec.distant
					execute if predicate fast_leaf_decay:should_decay run {
						name decay
						execute store result score #doTileDrops leafDec.dummy run gamerule doTileDrops
						execute if score #doTileDrops leafDec.dummy matches 1 run loot spawn ~0.5 ~0.5 ~0.5 mine ~ ~ ~
						setblock ~ ~ ~ minecraft:air
						kill @s
					}
					scoreboard players set #continue leafDec.dummy 0
				}
				execute if score #continue leafDec.dummy matches 1 run kill @s[scores={leafDec.dummy=60..}]
			}
		}
	}
	execute as @e[type=minecraft:area_effect_cloud,tag=leafDec.front,limit=24] at @s run {
		name tick_front_marker
		tag @s remove leafDec.front
		execute positioned ~ ~-1 ~ if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:create_front_marker
		execute positioned ~ ~1 ~ if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:create_front_marker
		execute positioned ~-1 ~ ~ if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:create_front_marker
		execute positioned ~1 ~ ~ if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:create_front_marker
		execute positioned ~ ~ ~-1 if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:create_front_marker
		execute positioned ~ ~ ~1 if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:create_front_marker
	}
	execute as @a[predicate=fast_leaf_decay:should_start_raycasting] at @s anchored eyes positioned ^ ^ ^ run {
		name start_raycasting
		scoreboard players reset @s leafDec.oakL
		scoreboard players reset @s leafDec.spruceL
		scoreboard players reset @s leafDec.birchL
		scoreboard players reset @s leafDec.jungleL
		scoreboard players reset @s leafDec.acaciaL
		scoreboard players reset @s leafDec.darkOakL
		scoreboard players reset @s leafDec.oakS
		scoreboard players reset @s leafDec.spruceS
		scoreboard players reset @s leafDec.birchS
		scoreboard players reset @s leafDec.jungleS
		scoreboard players reset @s leafDec.acaciaS
		scoreboard players reset @s leafDec.darkOakS
		scoreboard players set #steps leafDec.dummy 50
		block {
			name raycast
			scoreboard players remove #steps leafDec.dummy 1
			block {
				name check
				execute align xyz run {
					name try_to_create_markers
					execute positioned ~ ~-1 ~ if block ~ ~ ~ #minecraft:leaves[persistent=false] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:iterate
					execute positioned ~ ~1 ~ if block ~ ~ ~ #minecraft:leaves[persistent=false] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:iterate
					execute positioned ~-1 ~ ~ if block ~ ~ ~ #minecraft:leaves[persistent=false] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:iterate
					execute positioned ~1 ~ ~ if block ~ ~ ~ #minecraft:leaves[persistent=false] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:iterate
					execute positioned ~ ~ ~-1 if block ~ ~ ~ #minecraft:leaves[persistent=false] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:iterate
					execute positioned ~ ~ ~1 if block ~ ~ ~ #minecraft:leaves[persistent=false] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:iterate
				}
			}
			execute unless score #steps leafDec.dummy matches 0 positioned ^ ^ ^0.1 run function $block
		}
	}
}
function iterate {
	scoreboard players set #continue leafDec.dummy 1
	execute as @e[type=minecraft:area_effect_cloud,tag=leafDec.marker,distance=..0.01] run {
		name reset_marker
		tag @s add leafDec.new
		scoreboard players set @s leafDec.dummy 0
		scoreboard players set #continue leafDec.dummy 0
	}
	execute if score #continue leafDec.dummy matches 1 run summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["leafDec.marker","leafDec.new"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
	LOOP (5, i) {
		execute if block ~ ~ ~ #minecraft:leaves[distance=<%this.i + 1%>] run {
			name check_leaves/<%this.i%>
			execute positioned ~ ~-1 ~ if predicate fast_leaf_decay:leaves/<%this.i%> unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:iterate
			execute positioned ~ ~1 ~ if predicate fast_leaf_decay:leaves/<%this.i%> unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:iterate
			execute positioned ~-1 ~ ~ if predicate fast_leaf_decay:leaves/<%this.i%> unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:iterate
			execute positioned ~1 ~ ~ if predicate fast_leaf_decay:leaves/<%this.i%> unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:iterate
			execute positioned ~ ~ ~-1 if predicate fast_leaf_decay:leaves/<%this.i%> unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:iterate
			execute positioned ~ ~ ~1 if predicate fast_leaf_decay:leaves/<%this.i%> unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:iterate
		}
	}
	execute if predicate fast_leaf_decay:leaves/4 run {
		name check_leaves/5
		execute positioned ~ ~-1 ~ if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:create_front_marker
		execute positioned ~ ~1 ~ if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:create_front_marker
		execute positioned ~-1 ~ ~ if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:create_front_marker
		execute positioned ~1 ~ ~ if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:create_front_marker
		execute positioned ~ ~ ~-1 if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:create_front_marker
		execute positioned ~ ~ ~1 if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:area_effect_cloud,tag=leafDec.new,distance=..0.01] run function fast_leaf_decay:create_front_marker
	}
}
function create_front_marker {
	scoreboard players set #continue leafDec.dummy 1
	execute as @e[type=minecraft:area_effect_cloud,tag=leafDec.marker,distance=..0.01] run function fast_leaf_decay:reset_marker
	execute if score #continue leafDec.dummy matches 1 run summon minecraft:area_effect_cloud ~ ~ ~ {Tags:["leafDec.marker","leafDec.front","leafDec.new"],Age:-2147483648,Duration:-1,WaitTime:-2147483648}
}
