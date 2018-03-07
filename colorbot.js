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
	data.guilds[guild.id] = [[], 0];
};
const guildDelete = guild => {
	console.log(`guildDelete ${guild.id}`);
	delete data.guilds[guild.id];
	save();
}
const sendHelp = (msg, perm) => {
	if(data.guilds[msg.guild.id][0]) {
		let help = `${msg.author} You can use the following commands.\n\n\`>🖌 set <color code | role name>\`\nSet your color or role.`;
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
const colorEmbed = hexCode => {
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
const properColorTest = /^#[\da-f]{6}$/;
client.on("message", msg => {
	if(msg.channel.type === "text" && !msg.system) {
		let content = msg.content;
		if(prefix.test(content)) {
			const member = msg.guild.member(msg.author);
			const perm = member.hasPermission(8);
			content = content.replace(prefix, "");
			if(content) {
				const spaceIndex = content.indexOf(" ");
				if(spaceIndex === -1) {
					content = [content];
				} else {
					content = [content.slice(0, spaceIndex), content.slice(spaceIndex+1)];
				}
				content[0] = content[0].toLowerCase();
				if(content[0] === "set") {
					if(colorTest.test(content[1])) {
						content[1] = content[1].replace(colorTest, "#$1$1$2$2$3$3$4").toLowerCase();
						const red = parseInt(content[1].slice(1, 3), 16);
						const green = parseInt(content[1].slice(3, 5), 16);
						const blue = parseInt(content[1].slice(5, 7), 16);
						const addColorRole = () => {
							const currentRole = guild.roles.find("name", content[1]);
							if(currentRole) {
								member.roles.add(currentRole).catch(err => {
									permWarn(msg.guild, "manage roles");
								});
								msg.channel.send(msg.author + " Your color has been set.", {
									embed: {
										title: content[1],
										color: parseInt(content[1].slice(1), 16)
									}
								}).catch(() => {
									permWarn(msg.guild, `send messages or embed links, in the ${msg.channel} channel or otherwise`);
								});
							} else {
								guild.roles.create({
									data: {
										name: content[1],
										color: content[1],
										permissions: 0
									}
								}).then(function(role) {
									member.roles.add(role);
									msg.channel.send(msg.author + " Your color has been set.");
								}).catch(err => {
									console.log(err.name, err.message);
									if(err) {
										permWarn(msg.guild, "manage roles");
									} else {
										const guildRoles = Array.from(guild.roles.values());
										let colors = [];
										for(let i of guildRoles) {
											if(properColorTest.test(i.name)) {
												const redDiff = parseInt(i.name.slice(1, 3), 16)-red;
												const greenDiff = parseInt(i.name.slice(3, 5), 16)-green;
												const blueDiff = parseInt(guildRoles[i].name.slice(5, 7), 16)-blue;
												colors.push([i, redDiff*redDiff+greenDiff*greenDiff+blueDiff*blueDiff]);
											}
										}
										colors = colors.sort((a, b) => a[1]-b[1]);
										let roles = colors[0][0];
										for(let i = 1; i < 10; i++) {
											roles += " " + colors[i][0];
										}
										msg.channel.send(msg.author + " The maximum role limit has been reached and no more color roles can be created. If you want, you can choose a color that someone else is already using. Below are some similar colors I found to the one you entered.\n" + roles).catch(() => {
											permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
										});
									}
								});
							}
						};
						const roleArray = Array.from(member.roles.values());
						let roleRemoved = false;
						for(let i of roleArray) {
							if(properColorTest.test(i.name)) {
								if(Array.from(i.members.values()).length > 1) {
									member.roles.remove(i).then(addColorRole);
								} else {
									i.delete().then(addColorRole);
								}
								roleRemoved = true;
								break;
							}
						}
						if(!roleRemoved) {
							addColorRole();
						}
					} else {
						msg.channel.send(`${msg.author} That's not a valid color code! If you don't know how color codes work, Google has a color picker built into the search page if you search "color picker".`);
					}
				} else if(perm) {
					if(content[0] === "limit") {

					} else {
						sendHelp(msg, perm);
					}
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
