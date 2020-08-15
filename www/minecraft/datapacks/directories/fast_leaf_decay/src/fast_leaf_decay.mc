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
	schedule clear fast_leaf_decay:tick
}
clock 1t {
	name tick
	execute as @e[type=minecraft:item_frame,tag=leafDec.marker] at @s run {
		name tick_marker
		particle flame ~ ~-0.5 ~
		scoreboard players add @s leafDec.dummy 1
		execute if score @s leafDec.dummy matches 7.. run {
			name check_marker
			execute unless block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] run kill @s
			execute if predicate fast_leaf_decay:should_decay if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] align xyz run {
				name decay
				execute store result score #doTileDrops leafDec.dummy run gamerule doTileDrops
				execute if score #doTileDrops leafDec.dummy matches 1 run loot spawn ~0.5 ~0.5 ~0.5 mine ~ ~ ~
				setblock ~ ~ ~ minecraft:air
				kill @s
			}
		}
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
			execute align xyz unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run {
				name try_to_iterate
				execute if block ~ ~ ~ #minecraft:leaves[persistent=false] run summon minecraft:item_frame ~ ~ ~ {Tags:["leafDec.marker","leafDec.new"],Fixed:1b,Invisible:1b}
				execute positioned ~ ~-1 ~ if block ~ ~ ~ #minecraft:leaves[persistent=false] unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
				execute positioned ~-1 ~ ~ if block ~ ~ ~ #minecraft:leaves[persistent=false] unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
				execute positioned ~ ~ ~-1 if block ~ ~ ~ #minecraft:leaves[persistent=false] unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
				execute positioned ~ ~1 ~ if block ~ ~ ~ #minecraft:leaves[persistent=false] unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
				execute positioned ~1 ~ ~ if block ~ ~ ~ #minecraft:leaves[persistent=false] unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
				execute positioned ~ ~ ~1 if block ~ ~ ~ #minecraft:leaves[persistent=false] unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
			}
			execute unless score #steps leafDec.dummy matches 0 positioned ^ ^ ^0.1 run function $block
		}
	}
}
function iterate {
	summon minecraft:item_frame ~ ~ ~ {Tags:["leafDec.marker","leafDec.new"],Fixed:1b,Invisible:1b}
	scoreboard players operation @e[type=minecraft:item_frame,tag=leafDec.new] leafDec.dummy = @s[type=minecraft:item_frame] leafDec.dummy
	execute as @e[type=minecraft:item_frame,tag=leafDec.new] run {
		name try_to_check_surroundings
		tag @s remove leafDec.new
		scoreboard players add @s leafDec.dummy 1
		execute if score @s leafDec.dummy matches ..1000 run {
			name check_surroundings
			LOOP (5, i) {
				execute if block ~ ~ ~ #minecraft:leaves[distance=<%this.i%>] run {
					name check_leaves/<%this.i%>
					execute positioned ~ ~-1 ~ if predicate fast_leaf_decay:leaves/<%this.i%> unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
					execute positioned ~ ~1 ~ if predicate fast_leaf_decay:leaves/<%this.i%> unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
					execute positioned ~-1 ~ ~ if predicate fast_leaf_decay:leaves/<%this.i%> unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
					execute positioned ~1 ~ ~ if predicate fast_leaf_decay:leaves/<%this.i%> unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
					execute positioned ~ ~ ~-1 if predicate fast_leaf_decay:leaves/<%this.i%> unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
					execute positioned ~ ~ ~1 if predicate fast_leaf_decay:leaves/<%this.i%> unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
				}
			}
			execute if predicate fast_leaf_decay:leaves/5 run {
				name check_leaves/6
				execute positioned ~ ~-1 ~ if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
				execute positioned ~ ~1 ~ if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
				execute positioned ~-1 ~ ~ if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
				execute positioned ~1 ~ ~ if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
				execute positioned ~ ~ ~-1 if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
				execute positioned ~ ~ ~1 if block ~ ~ ~ #minecraft:leaves[persistent=false,distance=7] unless entity @e[type=minecraft:item_frame,tag=leafDec.marker,dx=0,dy=0,dz=0] run function fast_leaf_decay:iterate
			}
		}
		scoreboard players set @s leafDec.dummy 0
		setblock ~ ~ ~ cobweb
	}
}
