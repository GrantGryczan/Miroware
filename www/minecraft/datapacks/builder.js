const fs = require("fs-extra");
const archiver = require("archiver");
let id = process.cwd().replace(/\\/g, "/");
id = id.slice(id.lastIndexOf("/") + 1);
const destinations = [`../../files/${id}.zip`, `${process.env.APPDATA}/.minecraft/saves/test/datapacks/${id}.zip`];
module.exports = {
	onBuildSuccess: ({config}) => new Promise(async resolve => {
		const archive = archiver("zip");
		for (const destination of destinations) {
			archive.pipe(fs.createWriteStream(destination));
		}
		archive.directory("data", "data");
		archive.append(`{\n\t"pack": {\n\t\t"pack_format": 5,\n\t\t"description": [{"text":${JSON.stringify(`${config.pack.name} ${config.pack.version.join(".")}`)},"color":"aqua"},{"text":"\\nmc.miro.gg/datapacks","color":"dark_aqua"}]\n\t}\n}\n`, {
			name: "pack.mcmeta"
		});
		archive.file("pack.png", {
			name: "pack.png"
		});
		await archive.finalize();
		resolve();
	})
};
