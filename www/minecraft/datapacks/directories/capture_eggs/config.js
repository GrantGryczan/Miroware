const builder = require("../../builder.js");
module.exports = {
	pack: require("./pack.js"),
	mc: {
		dev: false,
		header: "",
		rootNamespace: null,
		data: {
			spawnEggs: [
				"minecraft:bat",
				"minecraft:bee",
				"minecraft:blaze",
				"minecraft:cat",
				"minecraft:cave_spider",
				"minecraft:chicken",
				"minecraft:cod",
				"minecraft:cow",
				"minecraft:creeper",
				"minecraft:dolphin",
				"minecraft:donkey",
				"minecraft:drowned",
				"minecraft:elder_guardian",
				"minecraft:enderman",
				"minecraft:endermite",
				"minecraft:evoker",
				"minecraft:fox",
				"minecraft:ghast",
				"minecraft:guardian",
				"minecraft:hoglin",
				"minecraft:horse",
				"minecraft:husk",
				"minecraft:llama",
				"minecraft:magma_cube",
				"minecraft:mooshroom",
				"minecraft:mule",
				"minecraft:ocelot",
				"minecraft:panda",
				"minecraft:parrot",
				"minecraft:phantom",
				"minecraft:pig",
				"minecraft:piglin",
				"minecraft:piglin_brute",
				"minecraft:pillager",
				"minecraft:polar_bear",
				"minecraft:pufferfish",
				"minecraft:rabbit",
				"minecraft:ravager",
				"minecraft:salmon",
				"minecraft:sheep",
				"minecraft:shulker",
				"minecraft:silverfish",
				"minecraft:skeleton",
				"minecraft:skeleton_horse",
				"minecraft:slime",
				"minecraft:spider",
				"minecraft:squid",
				"minecraft:stray",
				"minecraft:strider",
				"minecraft:trader_llama",
				"minecraft:tropical_fish",
				"minecraft:turtle",
				"minecraft:vex",
				"minecraft:villager",
				"minecraft:vindicator",
				"minecraft:wandering_trader",
				"minecraft:witch",
				"minecraft:wither_skeleton",
				"minecraft:wolf",
				"minecraft:zoglin",
				"minecraft:zombie",
				"minecraft:zombie_horse",
				"minecraft:zombie_villager",
				"minecraft:zombified_piglin"
			],
			notSpawnEggs: [
				{
					id: "minecraft:iron_golem",
					name: "Iron Golem",
					spawnEgg: "minecraft:wolf_spawn_egg"
				},
				{
					id: "minecraft:snow_golem",
					name: "Snow Golem",
					spawnEgg: "minecraft:polar_bear_spawn_egg"
				}
			]
		}
	},
	global: {
		onBuildSuccess: builder.onBuildSuccess
	}
};
