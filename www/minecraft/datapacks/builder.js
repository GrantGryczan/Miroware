const fs = require("fs-extra");
const archiver = require("archiver");
let id = process.cwd().replace(/\\/g, "/");
id = id.slice(id.lastIndexOf("/") + 1);
const packFormats = [
	{
		id: 7,
		versions: ["1.17"]
	},
	{
		id: 6,
		versions: ["1.16"]
	},
	{
		id: 5,
		versions: ["1.15"]
	},
	{
		id: 4,
		versions: ["1.13", "1.14"]
	}
];
module.exports = {
	onBuildSuccess: ({config}) => Promise.all([
		(async () => {
			const archive = archiver("zip");
			archive.pipe(fs.createWriteStream(`../../files/${id}.zip`));
			archive.pipe(fs.createWriteStream(`${process.env.APPDATA}/.minecraft/saves/test/datapacks/${id}.zip`));
			const scanDirectory = async parent => {
				const promises = [];
				for (const child of await fs.readdir(parent)) {
					const childPath = `${parent}/${child}`;
					if (child === 'tick.json') {
						await fs.unlink(childPath); // A quick fix for an MC-Build bug.
						continue;
					}
					promises.push(
						(await fs.stat(childPath)).isDirectory()
							? scanDirectory(childPath)
							: (async () => {
								const options = {
									name: childPath
								};
								if (child.endsWith(".json") || child.endsWith(".mcfunction")) {
									archive.append(
										(await fs.readFile(childPath, "utf8"))
											.replace(/run _command/g, "run_command") // A quick fix for an MC-Build bug.
											.replace(/COLOR_1/g, "dark_aqua")
											.replace(/COLOR_2/g, "aqua")
											.replace(/COLOR_3/g, "gold"),
										options
									);
								} else {
									archive.file(childPath, options);
								}
							})()
					);
				}
				await Promise.all(promises);
			};
			await scanDirectory("data");
			let packFormat = packFormats[0].id;
			for (const format of packFormats) {
				if (format.versions.some(version => config.pack.compatibility.includes(version))) {
					packFormat = format.id;
					break;
				}
			}
			archive.append(`{\n\t"pack": {\n\t\t"pack_format": ${packFormat},\n\t\t"description": [{"text":${JSON.stringify(`${config.pack.name} ${config.pack.version}`)},"color":"aqua"},{"text":"\\nmc.miro.gg/datapacks","color":"dark_aqua"}]\n\t}\n}\n`, {
				name: "pack.mcmeta"
			});
			if (packFormat !== 4 && packFormat !== 5) {
				archive.file("pack.png", {
					name: "pack.png"
				});
			}
			await archive.finalize();
		})(),
		config.pack.vt && Promise.all(config.pack.compatibility.filter(version => version !== "1.13" && version !== "1.14").map(version => (async () => {
			const name = config.pack.namespace.replace(/_/g, " ");
			const path = `../../../../../../VanillaTweaks/resources/datapacks/${version}/${name}`;
			const dataPath = `${path}/data`;
			await fs.rmdir(dataPath, {
				recursive: true
			});
			await fs.mkdir(dataPath, {
				recursive: true
			});
			const uninstallPath = `data/${config.pack.namespace}/functions/uninstall.mcfunction`;
			const scanDirectory = async parent => {
				const promises = [];
				for (const child of await fs.readdir(parent)) {
					const childPath = `${parent}/${child}`;
					const targetPath = `${path}/${childPath}`.replace(/grant_gryczan/g, "vanillatweaks");
					if ((await fs.stat(childPath)).isDirectory()) {
						await fs.mkdir(targetPath, {
							recursive: true
						});
						promises.push(scanDirectory(childPath));
					} else if (childPath !== "data/grant_gryczan/advancements/root.json") {
						if (childPath === uninstallPath) {
							await fs.mkdir(`${dataPath}/vanillatweaks/tags/functions`, {
								recursive: true
							});
							await fs.writeFile(`${dataPath}/vanillatweaks/tags/functions/uninstall.json`, `{\n\t"values": [\n\t\t"${config.pack.namespace}:uninstall"\n\t]\n}\n`);
						}
						promises.push(
							child.endsWith(".json") || child.endsWith(".mcfunction")
								? (async () => {
									await fs.writeFile(
										targetPath,
										(await fs.readFile(childPath, "utf8"))
											.replace(/run _command/g, "run_command") // A quick fix for an MC-Build bug.
											.replace(/grant_gryczan/g, "vanillatweaks")
											.replace(/COLOR_1/g, "gold")
											.replace(/COLOR_2/g, "yellow")
											.replace(/COLOR_3/g, "green")
									);
								})()
								: fs.copyFile(childPath, targetPath)
						);
					}
				}
				await Promise.all(promises);
			};
			await scanDirectory("data");
			await fs.copyFile(`../../../../../../VanillaTweaks/resources/datapacks/${version}/_template/data/vanillatweaks/advancements/root.json`, `${dataPath}/vanillatweaks/advancements/root.json`);
			let packFormat = packFormats[0].id;
			for (const format of packFormats) {
				if (format.versions.some(version => config.pack.compatibility.includes(version))) {
					packFormat = format.id;
					break;
				}
			}
			await fs.writeFile(`${path}/pack.mcmeta`, `{\n\t"pack": {\n\t\t"pack_format": ${packFormat},\n\t\t"description": [{"text":${JSON.stringify(`${config.pack.name}`)},"color":"gold"},{"text":"\\nvanillatweaks.net","color":"yellow"}]\n\t}\n}\n`);
			const metadataPath = `../../../../../../VanillaTweaks/resources/json/${version}/dpcategories.json`;
			await fs.writeFile(metadataPath, (await fs.readFile(metadataPath, "utf8")).replace(new RegExp(`((\\n\\t+)"name": "${name}",(?:\\2.+,)*\\2"version": )"[^"]+"`), `$1"${config.pack.version}"`));
		})()))
	])
};
