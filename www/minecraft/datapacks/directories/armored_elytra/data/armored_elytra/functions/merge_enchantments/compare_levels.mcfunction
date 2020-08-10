execute store result score #elytraValue armEly.dummy run data get storage armored_elytra:storage elytraEnch[0].lvl
execute store result score #chestplateValue armEly.dummy run data get storage armored_elytra:storage chestplateEnch[0].lvl
execute if score #chestplateValue armEly.dummy > #elytraValue armEly.dummy run data modify storage armored_elytra:storage finalEnch append from storage armored_elytra:storage chestplateEnch[0]
execute unless score #chestplateValue armEly.dummy > #elytraValue armEly.dummy run data modify storage armored_elytra:storage finalEnch append from storage armored_elytra:storage elytraEnch[0]
data remove storage armored_elytra:storage elytraEnch[0]
scoreboard players remove #elytraTotal armEly.dummy 1
data remove storage armored_elytra:storage chestplateEnch[0]
scoreboard players set #found armEly.dummy 1