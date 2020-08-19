const fs = require("fs-extra");
const archiver = require("archiver");
let id = process.cwd().replace(/\\/g, "/");
id = id.slice(id.lastIndexOf("/") + 1);
const destinations = [`../../files/${id}.zip`, `${process.env.APPDATA}/.minecraft/saves/test/datapacks/${id}.zip`];
const packFormats = [{
	id: 6,
	versions: ["1.16"]
}, {
	id: 5,
	versions: ["1.15"]
}, {
	id: 4,
	versions: ["1.13", "1.14"]
}];
module.exports = {
	onBuildSuccess: ({config}) => new Promise(async resolve => {
		const archive = archiver("zip");
		for (const destination of destinations) {
			archive.pipe(fs.createWriteStream(destination));
		}
		archive.directory("data", "data");
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
		resolve();
	})
};
