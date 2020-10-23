const fs = require("fs-extra");
const builder = require("../../builder.js");
module.exports = {
	pack: require("./pack.js"),
	mc: {
		dev: false,
		header: "",
		rootNamespace: null,
		data: {
			items: [
				{
					id: "turtle_helmet",
					durability: 275,
					slot: "armor.head"
				},
				{
					id: "flint_and_steel",
					durability: 64,
					slot: "weapon"
				},
				{
					id: "bow",
					durability: 384,
					slot: "weapon"
				},
				{
					id: "wooden_sword",
					durability: 59,
					slot: "weapon"
				},
				{
					id: "wooden_shovel",
					durability: 59,
					slot: "weapon"
				},
				{
					id: "wooden_pickaxe",
					durability: 59,
					slot: "weapon"
				},
				{
					id: "wooden_axe",
					durability: 59,
					slot: "weapon"
				},
				{
					id: "wooden_hoe",
					durability: 59,
					slot: "weapon"
				},
				{
					id: "stone_sword",
					durability: 131,
					slot: "weapon"
				},
				{
					id: "stone_shovel",
					durability: 131,
					slot: "weapon"
				},
				{
					id: "stone_pickaxe",
					durability: 131,
					slot: "weapon"
				},
				{
					id: "stone_axe",
					durability: 131,
					slot: "weapon"
				},
				{
					id: "stone_hoe",
					durability: 131,
					slot: "weapon"
				},
				{
					id: "golden_sword",
					durability: 32,
					slot: "weapon"
				},
				{
					id: "golden_shovel",
					durability: 32,
					slot: "weapon"
				},
				{
					id: "golden_pickaxe",
					durability: 32,
					slot: "weapon"
				},
				{
					id: "golden_axe",
					durability: 32,
					slot: "weapon"
				},
				{
					id: "golden_hoe",
					durability: 32,
					slot: "weapon"
				},
				{
					id: "iron_sword",
					durability: 250,
					slot: "weapon"
				},
				{
					id: "iron_shovel",
					durability: 250,
					slot: "weapon"
				},
				{
					id: "iron_pickaxe",
					durability: 250,
					slot: "weapon"
				},
				{
					id: "iron_axe",
					durability: 250,
					slot: "weapon"
				},
				{
					id: "iron_hoe",
					durability: 250,
					slot: "weapon"
				},
				{
					id: "diamond_sword",
					durability: 1561,
					slot: "weapon"
				},
				{
					id: "diamond_shovel",
					durability: 1561,
					slot: "weapon"
				},
				{
					id: "diamond_pickaxe",
					durability: 1561,
					slot: "weapon"
				},
				{
					id: "diamond_axe",
					durability: 1561,
					slot: "weapon"
				},
				{
					id: "diamond_hoe",
					durability: 1561,
					slot: "weapon"
				},
				{
					id: "netherite_sword",
					durability: 2031,
					slot: "weapon"
				},
				{
					id: "netherite_shovel",
					durability: 2031,
					slot: "weapon"
				},
				{
					id: "netherite_pickaxe",
					durability: 2031,
					slot: "weapon"
				},
				{
					id: "netherite_axe",
					durability: 2031,
					slot: "weapon"
				},
				{
					id: "netherite_hoe",
					durability: 2031,
					slot: "weapon"
				},
				{
					id: "leather_helmet",
					durability: 55,
					slot: "armor.head"
				},
				{
					id: "leather_chestplate",
					durability: 80,
					slot: "armor.chest"
				},
				{
					id: "leather_leggings",
					durability: 75,
					slot: "armor.legs"
				},
				{
					id: "leather_boots",
					durability: 65,
					slot: "armor.feet"
				},
				{
					id: "chainmail_helmet",
					durability: 165,
					slot: "armor.head"
				},
				{
					id: "chainmail_chestplate",
					durability: 240,
					slot: "armor.chest"
				},
				{
					id: "chainmail_leggings",
					durability: 225,
					slot: "armor.legs"
				},
				{
					id: "chainmail_boots",
					durability: 195,
					slot: "armor.feet"
				},
				{
					id: "iron_helmet",
					durability: 165,
					slot: "armor.head"
				},
				{
					id: "iron_chestplate",
					durability: 240,
					slot: "armor.chest"
				},
				{
					id: "iron_leggings",
					durability: 225,
					slot: "armor.legs"
				},
				{
					id: "iron_boots",
					durability: 195,
					slot: "armor.feet"
				},
				{
					id: "diamond_helmet",
					durability: 363,
					slot: "armor.head"
				},
				{
					id: "diamond_chestplate",
					durability: 528,
					slot: "armor.chest"
				},
				{
					id: "diamond_leggings",
					durability: 495,
					slot: "armor.legs"
				},
				{
					id: "diamond_boots",
					durability: 429,
					slot: "armor.feet"
				},
				{
					id: "golden_helmet",
					durability: 77,
					slot: "armor.head"
				},
				{
					id: "golden_chestplate",
					durability: 112,
					slot: "armor.chest"
				},
				{
					id: "golden_leggings",
					durability: 105,
					slot: "armor.legs"
				},
				{
					id: "golden_boots",
					durability: 91,
					slot: "armor.feet"
				},
				{
					id: "netherite_helmet",
					durability: 407,
					slot: "armor.head"
				},
				{
					id: "netherite_chestplate",
					durability: 592,
					slot: "armor.chest"
				},
				{
					id: "netherite_leggings",
					durability: 555,
					slot: "armor.legs"
				},
				{
					id: "netherite_boots",
					durability: 481,
					slot: "armor.feet"
				},
				{
					id: "fishing_rod",
					durability: 64,
					slot: "weapon"
				},
				{
					id: "shears",
					durability: 238,
					slot: "weapon"
				},
				{
					id: "carrot_on_a_stick",
					durability: 25,
					slot: "weapon",
					maxDurability: 7
				},
				{
					id: "warped_fungus_on_a_stick",
					durability: 100,
					slot: "weapon"
				},
				{
					id: "shield",
					durability: 336,
					slot: "weapon"
				},
				{
					id: "elytra",
					durability: 432,
					slot: "armor.chest",
					minDurability: 2
				},
				{
					id: "trident",
					durability: 250,
					slot: "weapon"
				},
				{
					id: "crossbow",
					durability: 326,
					slot: "weapon"
				}
			],
			slots: {
				"armor.head": 103,
				"armor.chest": 102,
				"armor.legs": 101,
				"armor.feet": 100
			}
		}
	},
	global: {
		onBuildSuccess: ({config}) => {
			for (const item of config.mc.data.items) {
				const slotWeapon = item.slot === "weapon";
				fs.writeFile(`data/durability_ping/advancements/damage/${item.id}.json`, `{
	"display": {
		"icon": {
			"item": "minecraft:air"
		},
		"title": "",
		"description": "",
		"show_toast": false,
		"announce_to_chat": false,
		"hidden": true
	},
	"criteria": {
		"item_durability_changed": {
			"trigger": "minecraft:item_durability_changed",
			"conditions": {
				"durability": {
					"min": ${item.minDurability || 1},
					"max": ${item.maxDurability || Math.round(item.durability / 10)}
				},
				"item": {
					"item": "minecraft:${item.id}"
				},
				"player": [
					{
						"condition": "minecraft:inverted",
						"term": {
							"condition": "minecraft:entity_scores",
							"entity": "this",
							"scores": {
								"duraPing.${slotWeapon ? "weapon" : "armor"}": {
									"min": 1,
									"max": 2147483647
								}
							}
						}
					},
					{
						"condition": "minecraft:inverted",
						"term": {
							"condition": "minecraft:entity_scores",
							"entity": "this",
							"scores": {
								"duraPing.config": ${slotWeapon ? `{
									"min": 100,
									"max": 299
								}` : `{
									"min": 200,
									"max": 399
								}`}
							}
						}
					}
				]
			}
		}
	},
	"rewards": {
		"function": "durability_ping:damage"
	}
}
`);
			}
			builder.onBuildSuccess({
				config
			});
		}
	}
};
