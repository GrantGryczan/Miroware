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
	data.guilds[guild.id] = [0, {}];
};
const guildDelete = guild => {
	console.log(`guildDelete ${guild.id}`);
	delete data.guilds[guild.id];
	save();
}
const sendHelp = (msg, perm) => {
	let help = `${msg.author} You can use the following commands.\n\n\`>🖌 set <color>\`\nSet your color.\n\n\`>🖌 reset\`\nReset your color role.\n\n\`>🖌 get <color>\`\nShow color info.\n\n\`>🖌 list\`\nList all role groups, grouped roles, and role limits per each user of each group.\n\n\`>🖌 add <role name>\`\nSet your role for its role group.\n\n\`>🖌 remove <role name>\`\nRemove a role from your user.`;
	if(perm) {
		help += `\n\nAs a member of the Discord server with administrative permission, you can use the following commands.\n\n\`>🖌 create <group name>\`\nCreate a role group.\n\n\`>🖌 group <group name> <role name>\`\nAdd a role to a role group.\n\n\`>🖌 ungroup <role name>\`\nRemove a role from its role group.\n\n\`>🖌 limit <group name> <number>\`\nLimit how many roles each user can have from a group. (This defaults to 1 for each group. Set to 0 to remove the limit.)\n\n\`>🖌 rename <group name> <new group name>\`\nRename a role group.\n\n\`>🖌 delete <group name>\`\nDelete a role group.`;
	}
	help += "\n\nTo invite me to one of your own Discord servers, you can go to <https://miroware.io/discord/colorbot/>.";
	msg.channel.send(help).catch(() => {
		permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
	});
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
const colorEmbed = hex => {
	const dec = parseInt(hex.slice(1), 16);
	const red = parseInt(hex.slice(1, 3), 16);
	const green = parseInt(hex.slice(3, 5), 16);
	const blue = parseInt(hex.slice(5, 7), 16);
	return {
		embed: {
			color: dec,
			fields: [
				{
					name: "HEX",
					value: hex,
					inline: true
				},
				{
					name: "DEC",
					value: String(dec),
					inline: true
				},
				{
					name: "RGB",
					value: `rgb(${red}, ${green}, ${blue})`,
					inline: true
				},
				{
					name: "HSV",
					value: `TODO`,
					inline: true
				},
				{
					name: "HSL",
					value: `TODO`,
					inline: true
				},
				{
					name: "CMYK",
					value: `TODO`,
					inline: true
				}
			]
		}
	};
};
const prefix = /^> ?🖌 ?/;
const colorTest = /^#?(?:([\da-f])([\da-f])([\da-f])|([\da-f]{6}))$/i;
const properColorTest = /^#[\da-f]{6}$/;
const removeRole = member => {
	const roleArray = Array.from(member.roles.values());
	for(let i of roleArray) {
		if(properColorTest.test(i.name)) {
			if(Array.from(i.members.values()).length > 1) {
				return member.roles.remove(i);
			} else {
				return i.delete();
			}
			break;
		}
	}
	return Promise.resolve();
};
const ungroup = (guild, id) => {
	let found = false;
	for(let i of Object.keys(data.guilds[guild][1])) {
		const roleIndex = data.guilds[guild][1][i][1].indexOf(id);
		if(roleIndex !== -1) {
			data.guilds[guild][1][i][1].splice(roleIndex, 1);
			found = true;
			break;
		}
	}
	return found;
};
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
					content = [content, ""];
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
							const currentRole = msg.guild.roles.find("name", content[1]);
							if(currentRole) {
								member.roles.add(currentRole).catch(err => {
									permWarn(msg.guild, "manage roles, above mine or otherwise");
								});
								msg.channel.send(msg.author + " Your color has been set.", colorEmbed(content[1])).catch(() => {
									permWarn(msg.guild, `send messages or embed links, in the ${msg.channel} channel or otherwise`);
								});
							} else {
								msg.guild.roles.create({
									data: {
										name: content[1],
										color: content[1],
										permissions: 0
									}
								}).then(role => {
									member.roles.add(role);
									msg.channel.send(msg.author + " Your color has been set.", colorEmbed(content[1])).catch(() => {
										permWarn(msg.guild, `send messages or embed links, in the ${msg.channel} channel or otherwise`);
									});
								}).catch(err => {
									if(err.message === "Missing Permissions") {
										permWarn(msg.guild, "manage roles");
									} else {
										const guildRoles = Array.from(msg.guild.roles.values());
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
						removeRole(member).then(addColorRole).catch(err => {
							permWarn(msg.guild, "manage roles, above mine or otherwise");
						});
					} else {
						msg.channel.send(`${msg.author} That's not a valid color code! If you don't know how color codes work, Google has a color picker built into the search page if you search "color picker".`).catch(() => {
							permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
						});
					}
				} else if(content[0] === "reset") {
					removeRole(member).then(() => {
						msg.channel.send(`${msg.author} Your color role has been reset.`).catch(() => {
							permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
						});
					}).catch(err => {
						permWarn(msg.guild, "manage roles, above mine or otherwise");
					});
				} else if(content[0] === "get") {
					if(colorTest.test(content[1])) {
						content[1] = content[1].replace(colorTest, "#$1$1$2$2$3$3$4").toLowerCase();
						msg.channel.send(String(msg.author), colorEmbed(content[1])).catch(() => {
							permWarn(msg.guild, `send messages or embed links, in the ${msg.channel} channel or otherwise`);
						});
					} else {
						msg.channel.send(`${msg.author} That's not a valid color code! If you don't know how color codes work, Google has a color picker built into the search page if you search "color picker".`).catch(() => {
							permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
						});
					}
				} else if(content[0] === "list") {
					if(Object.keys(data.guilds[msg.guild.id][1]).length) {
						const fields = [];
						for(let i of Object.keys(data.guilds[msg.guild.id][1])) {
							fields.push({
								name: `${i} (${data.guilds[msg.guild.id][1][i][0] ? `limit: ${data.guilds[msg.guild.id][1][i][0]}` : "no limit"})`,
								value: data.guilds[msg.guild.id][1][i][1].length ? data.guilds[msg.guild.id][1][i][1].map(a => msg.guild.roles.get(a)).join(" ") : "(empty)"
							});
						}
						msg.channel.send(String(msg.author), {
							embed: {
								fields: fields
							}
						}).catch(() => {
							permWarn(msg.guild, `send messages or embed links, in the ${msg.channel} channel or otherwise`);
						});
					} else {
						msg.channel.send(`${msg.author} No role groups were found.`).catch(() => {
							permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
						});
					}
				} else if(content[0] === "add") {
					
				} else if(content[0] === "remove") {
					
				} else if(perm) {
					if(content[0] === "create") {
						if(content[1]) {
							if(content[1].includes(" ")) {
								msg.channel.send(`${msg.author} Group names cannot contain spaces.`).catch(() => {
									permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
								});
							} else if(!/^[a-z0-9]*$/i.test(content[1])) {
								msg.channel.send(`${msg.author} Group names must be alphanumeric.`).catch(() => {
									permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
								});
							} else if(data.guilds[msg.guild.id][1][content[1]]) {
								msg.channel.send(`${msg.author} A group by that name already exists.`).catch(() => {
									permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
								});
							} else {
								data.guilds[msg.guild.id][1][content[1]] = [1, []];
								msg.channel.send(`${msg.author} The ${italicize(content[1])} role group has been created.`).catch(() => {
									permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
								});
								save();
							}
						} else {
							msg.channel.send(`${msg.author} No group name was specified.`).catch(() => {
								permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
							});
						}
					} else if(content[0] === "group") {
						if(content[1]) {
							const spaceIndex2 = content[1].indexOf(" ");
							if(spaceIndex2 === -1) {
								msg.channel.send(`${msg.author} No role name was specified.`).catch(() => {
									permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
								});
							} else {
								const role = msg.guild.roles.find("name", content[1].slice(spaceIndex2+1));
								if(role) {
									const found = ungroup(msg.guild.id, role.id);
									const group = data.guilds[msg.guild.id][1][content[1].slice(0, spaceIndex2)];
									if(group) {
										group[1].push(role.id);
										msg.channel.send(`${msg.author} That role has been ${found ? "moved" : "added"} to that group.`).catch(() => {
											permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
										});
										save();
									} else {
										msg.channel.send(`${msg.author} No group was found by that name.`).catch(() => {
											permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
										});
									}
								} else {
									msg.channel.send(`${msg.author} No role was found by that name.`).catch(() => {
										permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
									});
								}
							}
						} else {
							msg.channel.send(`${msg.author} No group name was specified.`).catch(() => {
								permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
							});
						}
					} else if(content[0] === "ungroup") {
						if(content[1]) {
							const role = msg.guild.roles.find("name", content[1]);
							if(role) {
								if(ungroup(msg.guild.id, role.id)) {
									msg.channel.send(`${msg.author} That role has been ungrouped.`).catch(() => {
										permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
									});
									save();
								} else {
									msg.channel.send(`${msg.author} That role is not in a group.`).catch(() => {
										permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
									});
								}
							} else {
								msg.channel.send(`${msg.author} No role was found by that name.`).catch(() => {
									permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
								});
							}
						} else {
							msg.channel.send(`${msg.author} No role was specified.`).catch(() => {
								permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
							});
						}
					} else if(content[0] === "limit") {
						content[1] = content[1].split(" ", 2);
						if(content[1].length < 2) {
							msg.channel.send(`${msg.author} No ${content[1][0] ? "limit" : "group"} was specified.`).catch(() => {
								permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
							});
						} else if(isNaN(content[1][1])) {
							msg.channel.send(`${msg.author} That is not a valid number.`).catch(() => {
								permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
							});
						} else if(data.guilds[msg.guild.id][1][content[1][0]]) {
							const limit = parseInt(content[1][1]);
							msg.channel.send(`${msg.author} The role limit of the ${italicize(content[1][0])} group has been set to ${data.guilds[msg.guild.id][1][content[1][0]][0] = limit < 1 ? 0 : limit}.`).catch(() => {
								permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
							});
							save();
						} else {
							msg.channel.send(`${msg.author} No group was found by that name.`).catch(() => {
								permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
							});
						}
					} else if(content[0] === "rename") {
						content[1] = content[1].split(" ");
						if(content[1].length < 2) {
							msg.channel.send(`${msg.author} No group name was specified.`).catch(() => {
								permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
							});
						} else if(content[1].length > 2) {
							msg.channel.send(`${msg.author} Group names cannot contain spaces.`).catch(() => {
								permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
							});
						} else if(!/^[a-z0-9]*$/i.test(content[1][1])) {
							msg.channel.send(`${msg.author} Group names must be alphanumeric.`).catch(() => {
								permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
							});
						} else if(data.guilds[msg.guild.id][1][content[1][1]]) {
							msg.channel.send(`${msg.author} A group by that name already exists.`).catch(() => {
								permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
							});
						} else if(data.guilds[msg.guild.id][1][content[1][0]]) {
							data.guilds[msg.guild.id][1][content[1][1]] = data.guilds[msg.guild.id][1][content[1][0]];
							delete data.guilds[msg.guild.id][1][content[1][0]];
							msg.channel.send(`${msg.author} The ${italicize(content[1][0])} group is now the ${italicize(content[1][1])} group.`).catch(() => {
								permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
							});
							save();
						} else {
							msg.channel.send(`${msg.author} No group was found by that name.`).catch(() => {
								permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
							});
						}
					} else if(content[0] === "delete") {
						if(content[1]) {
							if(data.guilds[msg.guild.id][1][content[1]]) {
								msg.channel.send(`${msg.author} The ${italicize(content[1])} group has been deleted.`).catch(() => {
									permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
								});
								delete data.guilds[msg.guild.id][1][content[1]];
								save();
							} else {
								msg.channel.send(`${msg.author} No group was found by that name.`).catch(() => {
									permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
								});
							}
						} else {
							msg.channel.send(`${msg.author} No group was specified.`).catch(() => {
								permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
							});
						}
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
