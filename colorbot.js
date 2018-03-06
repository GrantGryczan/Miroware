console.log("< Colorbot >");
const fs = require("fs");
const Discord = require("discord.js");
let data;
const load = () => {
	data = JSON.parse(fs.readFileSync("data/colorbot.json"));
};
load();
const save = () => {
	fs.writeFileSync("data/colorbot.json", JSON.stringify(data));
};
const client = new Discord.Client();
client.once("error", process.exit);
client.once("disconnect", process.exit);
const italicize = str => `_${JSON.stringify(String(str)).slice(1, -1).replace(/_/g, "\\_")}_`;
const inform = (guild, str1, str2) => {
	if(guild.available) {
		guild.owner.send(str1).catch(() => {
			const channels = guild.channels.filterArray(channel => channel.type === "text");
			let i = -1;
			const testChannel = () => {
				i++;
				if(channels[i]) {
					channels[i].send(str2).catch(testChannel);
				}
			};
			testChannel();
		});
	}
};
const permWarn = (guild, perms) => {
	const warning = `, likely because I do not have permission to ${perms}. It is recommended that you enable these permissions for me in attempt to resolve this error.`;
	inform(guild, `An error occured on ${italicize(guild.name)+warning}`, `${guild.owner} An error occured${warning}`);
};
const guildCreate = guild => {
	console.log(`guildCreate ${guild.id}`);
	data.guilds[guild.id] = [...stuff];
};
const guildDelete = guild => {
	console.log(`guildDelete ${guild.id}`);
	delete data.guilds[guild.id];
	save();
}
const sendHelp = (msg, perm) => {
	if(data.guilds[msg.guild.id][0]) {
		let help = `${msg.author} You can use the following commands.\n\n\`>🖌 set <color>\`\nSet your color.`;
		if(perm) {
			help += `\nAs a member of the Discord server with administrative permission, you can use the following commands.\n\n\`>🖌 set <color>\`\nSet `;
		}
		help += "\nTo invite me to one of your own Discord servers, you can go to <https://miroware.io/discord/colorbot/>.";
		msg.channel.send(help).catch(() => {
			permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
		});
	} else {
		noStarboard(msg.guild);
	}
};
client.once("ready", () => {
	client.user.setPresence({
		status: "online"
	});
	client.user.setActivity("Enter \">🖌\" for info.");
	const guilds = Array.from(client.guilds.keys());
	for(let i of guilds) {
		if(!data.guilds[i]) {
			guildCreate(client.guilds.get(i));
		}
	}
	for(let i of Object.keys(data.guilds)) {
		if(!guilds.includes(i)) {
			guildDelete(guilds[i]);
		}
	}
	save();
});
client.on("guildCreate", guildCreate);
client.on("guildDelete", guildDelete);
const star = (msg, callback) => {
	if(data.guilds[msg.guild.id][0]) {
		console.log(`star ${msg.guild.id} ${msg.channel.id} ${msg.id}`);
		if(!starred.includes(msg.id)) {
			starred.push(msg.id);
		}
		const embed = {
			embed: {
				timestamp: msg.createdAt.toISOString(),
				color: data.guilds[msg.guild.id][3],
				footer: {
					text: `${decodeURI(data.guilds[msg.guild.id][1])} | ${msg.id}`
				},
				fields: [
					{
						name: "Author",
						value: String(msg.author),
						inline: true
					},
					{
						name: "Channel",
						value: String(msg.channel),
						inline: true
					},
					{
						name: "Message",
						value: msg.content || "..."
					}
				]
			}
		};
		if(embed.embed.fields[2].value.length > 1024) {
			embed.embed.fields[2].value = msg.content.slice(0, 1024);
			embed.embed.fields.push({
				name: "Continued",
				value: msg.content.slice(1024)
			});
		}
		const attachment = msg.attachments.first();
		if(attachment) {
			embed.embed.image = {
				url: attachment.url
			};
		}
		const starboard = msg.guild.channels.get(data.guilds[msg.guild.id][0]);
		starboard.send(embed).then(callback).catch(() => {
			permWarn(msg.guild, `read messages, send messages, ${attachment ? "and/or embed links" : "embed links, and/or attach files"}, in the ${starboard} channel or otherwise`);
		});
	} else {
		noStarboard(msg.guild);
	}
};
const prefix = /^> ?🖌 ?/;
const colorTest = /^#?(?:([\da-f])([\da-f])([\da-f])|([\da-f]{6}))$/i;
client.on("message", msg => {
	if(msg.channel.type === "text" && !msg.system) {
		let content = msg.content;
		if(prefix.test(content)) {
			const perm = msg.guild.member(msg.author).hasPermission(8);
			if(perm) {
				content = content.replace(prefix, "");
				if(content && colorTest.test(content)) {
					const code = content.replace(colorTest, "$1$1$2$2$3$3$4");
					data.guilds[msg.guild.id][3] = parseInt(code, 16);
					save();
					msg.channel.send(`Your username color has been changed to \`#${code}\`.`, {
						embed: {
							title: `#${code}`,
							color: data.guilds[msg.guild.id][3]
						}
					}).catch(() => {
						permWarn(msg.guild, `send messages or embed links, in the ${msg.channel} channel or otherwise`);
					});
				} else {
					sendHelp(msg, perm);
				}
			} else {
				sendHelp(msg, perm);
			}
		}
	}
});
client.login(data.token);
fs.watch(__filename, () => {
	process.exit();
});
const stdin = process.openStdin();
stdin.on("data", input => {
	console.log(eval(String(input)));
});
