console.log("< Colorbot >");
const fs = require("fs");
const Discord = require("discord.js");
const prefix = /^> ?🎨 ?/;
const underscores = /_/g;
const alphanumeric = /^[0-9a-z]*$/i;
const colorTest = /^#?(?:([\da-f])([\da-f])([\da-f])|([\da-f]{6}))$/i;
const properColorTest = /^#[\da-f]{6}$/;
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
const italicize = str => `_${JSON.stringify(String(str)).slice(1, -1).replace(underscores, "\\_")}_`;
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
const guildCreate = guild => {
	console.log(`guildCreate ${guild}`);
	data.guilds[guild] = [0, {}];
};
const guildDelete = guild => {
	console.log(`guildDelete ${guild}`);
	delete data.guilds[guild];
}
const permWarn = (guild, perms) => {
	const warning = `, likely because I do not have permission to ${perms}. It is recommended that you enable these permissions for me in attempt to resolve this error.`;
	inform(guild, `An error occured on ${italicize(guild.name)+warning}`, `${guild.owner} An error occured${warning}`);
};
const errSendMessages = msg => () => {
	permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
};
const errEmbedLinks = msg => () => {
	permWarn(msg.guild, `send messages or embed links, in the ${msg.channel} channel or otherwise`);
};
const errManageRoles = msg => () => {
	permWarn(msg.guild, "manage roles, above mine or otherwise");
};
const sendHelp = (msg, perm) => {
	let help = `${msg.author} You can use the following commands.${(data.guilds[msg.guild.id][0] || perm) ? `\n\n\`>🎨color <hex color code>\`\nSet your color${perm ? ", if open color mode is enabled" : ""}.\n\n\`>🎨reset\`\nReset your color role${perm ? ", if open color mode is enabled" : ""}.` : ""}\n\n\`>🎨list\`\nList all role groups and their roles.\n\n\`>🎨add <role name>\`\nGive yourself a role.\n\n\`>🎨remove <role name>\`\nRemove a role from yourself.`;
	if(perm) {
		help += `\n\nAs a member of this server with administrative permission, you can use the following commands.\n\n\`>🎨open\`\nToggle open color mode. This is disabled by default.\n\n\`>🎨create <group name>\`\nCreate a role group.\n\n\`>🎨group <group name> <role name>\`\nAdd a role to a role group.\n\n\`>🎨ungroup <role name>\`\nRemove a role from its role group.\n\n\`>🎨limit <group name> <number>\`\nLimit how many roles each user can have from a certain group. (This defaults to 1 for each group. Set to 0 to remove the limit.)\n\n\`>🎨rename <group name> <new group name>\`\nRename a role group.\n\n\`>🎨delete <group name>\`\nDelete a role group.`;
	}
	help += "\n\nTo invite me to one of your own Discord servers, you can go to <https://miroware.io/discord/colorbot/>.";
	msg.channel.send(help).catch(errSendMessages(msg));
};
client.once("ready", () => {
	for(const [i, v] of client.guilds) {
		if(!data.guilds[i]) {
			guildCreate(i);
		}
	}
	for(const i of Object.keys(data.guilds)) {
		const guild = client.guilds.get(i);
		if(guild) {
			for(const j of Object.keys(data.guilds[i][1])) {
				data.guilds[i][1][j][1] = data.guilds[i][1][j][1].filter(a => guild.roles.get(a));
			}
			for(const [j, v] of guild.roles) {
				if(properColorTest.test(v.name) && v.members.size === 0) {
					v.delete();
				}
			}
		} else {
			guildDelete(i);
		}
	}
	save();
	client.user.setPresence({
		status: "online"
	});
	client.user.setActivity("Enter \">🎨\" for info.");
});
client.on("guildCreate", guild => {
	guildCreate(guild.id);
	save();
});
client.on("guildDelete", guild => {
	guildDelete(guild.id);
	save();
});
client.on("guildMemberRemove", member => {
	for(const [i, v] of member.roles) {
		if(properColorTest.test(v.name) && v.members.size === 0) {
			v.delete();
			break;
		}
	}
});
client.on("roleDelete", role => {
	for(const i of Object.keys(data.guilds[role.guild.id][1])) {
		const roleIndex = data.guilds[role.guild.id][1][i][1].indexOf(role.id);
		if(roleIndex !== -1) {
			data.guilds[role.guild.id][1][i][1].splice(roleIndex, 1);
			break;
		}
	}
});
const setColor = (member, color, role, msg) => {
	member.roles.add(role).catch(errManageRoles(msg));
	const embed = {
		title: color,
		color: parseInt(color.slice(1), 16)
	};
	if(color === "#36393e") {
		embed.description = "Why?";
	}
	msg.channel.send(`${msg.author} Your color has been set.`, {
		embed
	}).catch(errEmbedLinks(msg));
};
const removeColor = member => {
	for(const [i, v] of member.roles) {
		if(properColorTest.test(v.name)) {
			if(v.members.size > 1) {
				return member.roles.remove(v);
			} else {
				return v.delete();
			}
			break;
		}
	}
	return Promise.resolve();
};
const ungroup = (guild, role) => {
	let found = false;
	for(const i of Object.keys(data.guilds[guild][1])) {
		const roleIndex = data.guilds[guild][1][i][1].indexOf(role);
		if(roleIndex !== -1) {
			data.guilds[guild][1][i][1].splice(roleIndex, 1);
			found = true;
			break;
		}
	}
	return found;
};
client.on("message", async msg => {
	if(msg.channel.type === "text" && !msg.system) {
		let content = msg.content;
		if(prefix.test(content)) {
			const member = msg.guild.member(msg.author) || await msg.guild.members.fetch(msg.author);
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
				const contentIsColor = content[0] === "color" || content[0] === "colour";
				if(contentIsColor || content[0] === "reset") {
					if(data.guilds[msg.guild.id][0] === 0) {
						msg.channel.send(`${msg.author} This command is unavailable, as open color mode is disabled.${perm ? " As a member of this server with administrative permission, you can enable it by entering \"`>🎨open`\"." : ""}`).catch(errSendMessages(msg));
					} else if(contentIsColor) {
						if(content[1]) {
							if(colorTest.test(content[1])) {
								content[1] = content[1].replace(colorTest, "#$1$1$2$2$3$3$4").toLowerCase();
								const addColorRole = () => {
									const currentRole = msg.guild.roles.find("name", content[1]) || msg.guild.roles.find(v => v.name.toLowerCase() === content[1].toLowerCase());
									if(currentRole) {
										setColor(member, content[1], currentRole, msg);
									} else {
										msg.guild.roles.create({
											data: {
												name: content[1],
												color: content[1],
												permissions: 0
											}
										}).then(role => {
											setColor(member, content[1], role, msg);
										}).catch(err => {
											if(err.message === "Missing Permissions") {
												permWarn(msg.guild, "manage roles");
											} else {
												const red = parseInt(content[1].slice(1, 3), 16);
												const green = parseInt(content[1].slice(3, 5), 16);
												const blue = parseInt(content[1].slice(5, 7), 16);
												const colors = [];
												for(const [i, v] of msg.guild.roles) {
													if(properColorTest.test(v.name)) {
														const redDiff = parseInt(v.name.slice(1, 3), 16)-red;
														const greenDiff = parseInt(v.name.slice(3, 5), 16)-green;
														const blueDiff = parseInt(v.name.slice(5, 7), 16)-blue;
														colors.push([v, redDiff*redDiff+greenDiff*greenDiff+blueDiff*blueDiff]);
													}
												}
												msg.channel.send(`${msg.author} The maximum role limit has been reached and no more color roles can be created. If you want, you can choose a color that someone else is already using. Below are some similar colors I found to the one you entered.`, {
													embed: {
														description: colors.sort((a, b) => a[1]-b[1]).slice(0, 20).map(a => a[0]).join(" "),
														color: parseInt(content[1].slice(1), 16)
													}
												}).catch(errEmbedLinks(msg));
											}
										});
									}
								};
								removeColor(member).then(addColorRole).catch(errManageRoles(msg));
							} else {
								msg.channel.send(`${msg.author} That's not a valid hex color code! If you don't know how hex color codes work, Google has a color picker built into the search page if you search "color picker".`).catch(errSendMessages(msg));
							}
						} else {
							msg.channel.send(`${msg.author} No color code was specified.`).catch(errSendMessages(msg));
						}
					} else if(content[0] === "reset") {
						removeColor(member).then(() => {
							msg.channel.send(`${msg.author} Your color role has been reset.`).catch(errSendMessages(msg));
						}).catch(errManageRoles(msg));
					}
				} else if(content[0] === "list") {
					if(Object.keys(data.guilds[msg.guild.id][1]).length) {
						const fields = [];
						for(const i of Object.keys(data.guilds[msg.guild.id][1])) {
							fields.push({
								name: `${i} (${data.guilds[msg.guild.id][1][i][0] ? `limit: ${data.guilds[msg.guild.id][1][i][0]}` : "no limit"})`,
								value: data.guilds[msg.guild.id][1][i][1].length ? data.guilds[msg.guild.id][1][i][1].map(a => msg.guild.roles.get(a)).join(" ") : "(empty)"
							});
						}
						msg.channel.send(String(msg.author), {
							embed: {
								fields: fields
							}
						}).catch(errEmbedLinks(msg));
					} else {
						msg.channel.send(`${msg.author} No role groups were found.`).catch(errEmbedLinks(msg));
					}
				} else if(content[0] === "add") {
					if(content[1]) {
						const role = msg.guild.roles.find("name", content[1]) || msg.guild.roles.find(v => v.name.toLowerCase() === content[1].toLowerCase());
						if(role) {
							let found = false;
							for(const i of Object.keys(data.guilds[msg.guild.id][1])) {
								const roleIndex = data.guilds[msg.guild.id][1][i][1].indexOf(role.id);
								if(roleIndex !== -1) {
									if(member.roles.has(role.id)) {
										msg.channel.send(`${msg.author} You already have that role.`).catch(errSendMessages(msg));
									} else {
										let has = 0;
										if(data.guilds[msg.guild.id][1][i][0]) {
											for(const v of data.guilds[msg.guild.id][1][i][1]) {
												if(member.roles.has(v)) {
													if(data.guilds[msg.guild.id][1][i][0] === 1) {
														member.roles.remove(v);
													} else {
														has++;
													}
												}
											}
										}
										if(data.guilds[msg.guild.id][1][i][0] <= 1 || has < data.guilds[msg.guild.id][1][i][0]) {
											member.roles.add(role).then(() => {
												msg.channel.send(`${msg.author} ${data.guilds[msg.guild.id][1][i][0] === 1 ? `Your ${italicize(i)} role has been set to ${italicize(role.name)}.` : `The ${italicize(role.name)} role has been added to your ${italicize(i)} roles.`}`).catch(errSendMessages(msg));
											}).catch(errManageRoles(msg));
										} else {
											msg.channel.send(`${msg.author} You already have ${has} ${italicize(i)} roles, so you need to remove one to add another.`).catch(errSendMessages(msg));
										}
									}
									found = true;
									break;
								}
							}
							if(!found) {
								msg.channel.send(`${msg.author} You do not have permission to add that role.`).catch(errSendMessages(msg));
							}
						} else {
							msg.channel.send(`${msg.author} No role was found by that name.`).catch(errSendMessages(msg));
						}
					} else {
						msg.channel.send(`${msg.author} No role name was specified.`).catch(errSendMessages(msg));
					}
				} else if(content[0] === "remove") {
					if(content[1]) {
						const role = msg.guild.roles.find("name", content[1]) || msg.guild.roles.find(v => v.name.toLowerCase() === content[1].toLowerCase());
						if(role) {
							let found = false;
							for(const i of Object.keys(data.guilds[msg.guild.id][1])) {
								const roleIndex = data.guilds[msg.guild.id][1][i][1].indexOf(role.id);
								if(roleIndex !== -1) {
									if(member.roles.has(role.id)) {
										member.roles.remove(role).then(() => {
											msg.channel.send(`${msg.author} That role has been removed from yourself.`).catch(errSendMessages(msg));
										}).catch(errManageRoles(msg));
									} else {
										msg.channel.send(`${msg.author} You do not have that role.`).catch(errSendMessages(msg));
									}
									found = true;
									break;
								}
							}
							if(!found) {
								msg.channel.send(`${msg.author} You do not have permission to remove that role.`).catch(errSendMessages(msg));
							}
						} else {
							msg.channel.send(`${msg.author} No role was found by that name.`).catch(errSendMessages(msg));
						}
					} else {
						msg.channel.send(`${msg.author} No role name was specified.`).catch(errSendMessages(msg));
					}
				} else if(perm) {
					if(content[0] === "open") {
						msg.channel.send(`${msg.author} Open color mode has been ${(data.guilds[msg.guild.id][0] = (data.guilds[msg.guild.id][0]+1)%2) ? "enabled" : "disabled"}.`).catch(errSendMessages(msg));
						save();
					} else if(content[0] === "create") {
						if(content[1]) {
							if(content[1].includes(" ")) {
								msg.channel.send(`${msg.author} Group names cannot contain spaces.`).catch(errSendMessages(msg));
							} else if(!alphanumeric.test(content[1])) {
								msg.channel.send(`${msg.author} Group names must be alphanumeric.`).catch(errSendMessages(msg));
							} else if(data.guilds[msg.guild.id][1][content[1]]) {
								msg.channel.send(`${msg.author} A group by that name already exists.`).catch(errSendMessages(msg));
							} else {
								data.guilds[msg.guild.id][1][content[1]] = [1, []];
								msg.channel.send(`${msg.author} The ${italicize(content[1])} role group has been created.`).catch(errSendMessages(msg));
								save();
							}
						} else {
							msg.channel.send(`${msg.author} No group name was specified.`).catch(errSendMessages(msg));
						}
					} else if(content[0] === "group") {
						if(content[1]) {
							const spaceIndex2 = content[1].indexOf(" ");
							if(spaceIndex2 === -1) {
								msg.channel.send(`${msg.author} No role name was specified.`).catch(errSendMessages(msg));
							} else {
								const group = data.guilds[msg.guild.id][1][content[1].slice(0, spaceIndex2)];
								if(group) {
									content[1] = content[1].slice(spaceIndex2+1);
									const role = msg.guild.roles.find("name", content[1]) || msg.guild.roles.find(v => v.name.toLowerCase() === content[1].toLowerCase());
									if(role) {
										if(group[1].includes(role.id)) {
											msg.channel.send(`${msg.author} That role is already in that group.`).catch(errSendMessages(msg));
										} else {
											const found = ungroup(msg.guild.id, role.id);
											group[1].push(role.id);
											msg.channel.send(`${msg.author} That role has been ${found ? "moved" : "added"} to that group.`).catch(errSendMessages(msg));
											save();
										}
									} else {
										msg.channel.send(`${msg.author} No role was found by that name.`).catch(errSendMessages(msg));
									}
								} else {
									msg.channel.send(`${msg.author} No group was found by that name.`).catch(errSendMessages(msg));
								}
							}
						} else {
							msg.channel.send(`${msg.author} No group name was specified.`).catch(errSendMessages(msg));
						}
					} else if(content[0] === "ungroup") {
						if(content[1]) {
							const role = msg.guild.roles.find("name", content[1]) || msg.guild.roles.find(v => v.name.toLowerCase() === content[1].toLowerCase());
							if(role) {
								if(ungroup(msg.guild.id, role.id)) {
									msg.channel.send(`${msg.author} That role has been ungrouped.`).catch(errSendMessages(msg));
									save();
								} else {
									msg.channel.send(`${msg.author} That role is not in a group.`).catch(errSendMessages(msg));
								}
							} else {
								msg.channel.send(`${msg.author} No role was found by that name.`).catch(errSendMessages(msg));
							}
						} else {
							msg.channel.send(`${msg.author} No role was specified.`).catch(errSendMessages(msg));
						}
					} else if(content[0] === "limit") {
						content[1] = content[1].split(" ", 2);
						if(content[1].length < 2) {
							msg.channel.send(`${msg.author} No ${content[1][0] ? "limit" : "group"} was specified.`).catch(errSendMessages(msg));
						} else if(isNaN(content[1][1])) {
							msg.channel.send(`${msg.author} That is not a valid number.`).catch(errSendMessages(msg));
						} else if(data.guilds[msg.guild.id][1][content[1][0]]) {
							const limit = parseInt(content[1][1]);
							msg.channel.send(`${msg.author} The role limit of the ${italicize(content[1][0])} group has been set to ${data.guilds[msg.guild.id][1][content[1][0]][0] = limit < 1 ? 0 : limit}.`).catch(errSendMessages(msg));
							save();
						} else {
							msg.channel.send(`${msg.author} No group was found by that name.`).catch(errSendMessages(msg));
						}
					} else if(content[0] === "rename") {
						content[1] = content[1].split(" ");
						if(content[1].length < 2) {
							msg.channel.send(`${msg.author} No group name was specified.`).catch(errSendMessages(msg));
						} else if(content[1].length > 2) {
							msg.channel.send(`${msg.author} Group names cannot contain spaces.`).catch(errSendMessages(msg));
						} else if(!alphanumeric.test(content[1][1])) {
							msg.channel.send(`${msg.author} Group names must be alphanumeric.`).catch(errSendMessages(msg));
						} else if(data.guilds[msg.guild.id][1][content[1][1]]) {
							msg.channel.send(`${msg.author} A group by that name already exists.`).catch(errSendMessages(msg));
						} else if(data.guilds[msg.guild.id][1][content[1][0]]) {
							data.guilds[msg.guild.id][1][content[1][1]] = data.guilds[msg.guild.id][1][content[1][0]];
							delete data.guilds[msg.guild.id][1][content[1][0]];
							msg.channel.send(`${msg.author} The ${italicize(content[1][0])} group is now the ${italicize(content[1][1])} group.`).catch(errSendMessages(msg));
							save();
						} else {
							msg.channel.send(`${msg.author} No group was found by that name.`).catch(errSendMessages(msg));
						}
					} else if(content[0] === "delete") {
						if(content[1]) {
							if(data.guilds[msg.guild.id][1][content[1]]) {
								msg.channel.send(`${msg.author} The ${italicize(content[1])} group has been deleted.`).catch(errSendMessages(msg));
								delete data.guilds[msg.guild.id][1][content[1]];
								save();
							} else {
								msg.channel.send(`${msg.author} No group was found by that name.`).catch(errSendMessages(msg));
							}
						} else {
							msg.channel.send(`${msg.author} No group was specified.`).catch(errSendMessages(msg));
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
process.openStdin().on("data", input => {
	console.log(eval(String(input)));
});
