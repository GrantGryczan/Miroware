"use strict";
console.log("< Colorbot >");
const fs = require("fs");
const Discord = require("discord.js");
const prefix = /^> ?🎨 */;
const spaces = / +/g;
const underscores = /_/g;
const colorTest = /^#?(?:([\da-f])([\da-f])([\da-f])|([\da-f]{6}))$/i;
const properColorTest = /^#[\da-f]{6}$/;
const italicize = str => `_${JSON.stringify(String(str)).slice(1, -1).replace(underscores, "\\_")}_`;
const byRoles = color => color[0];
const byTextChannels = channel => channel.type === "text";
const byColorDiff = (a, b) => a[1] - b[1];
let data;
const load = () => {
	data = JSON.parse(fs.readFileSync("secret/colorbot.json"));
};
load();
const save = () => {
	fs.writeFileSync("secret/colorbot.json", JSON.stringify(data));
};
const client = new Discord.Client();
const exitOnError = err => {
	console.error(err);
	process.exit(1);
};
process.once("unhandledRejection", exitOnError);
client.once("error", exitOnError);
client.once("disconnect", exitOnError);
const inform = (guild, str1, str2) => {
	if(guild.available) {
		guild.owner.send(str1).catch(() => {
			const channels = guild.channels.filter(byTextChannels);
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
const permWarn = (guild, perms) => {
	const warning = `, likely because I do not have permission to ${perms}. It is recommended that you enable these permissions for me in attempt to resolve this error.`;
	inform(guild, `An error occured on ${italicize(guild.name) + warning}`, `${guild.owner} An error occured${warning}`);
};
const errSendMessages = msg => () => {
	permWarn(msg.guild, `send messages, in the ${msg.channel} channel or otherwise`);
};
const errEmbedLinks = msg => () => {
	permWarn(msg.guild, `send messages or embed links, in the ${msg.channel} channel or otherwise`);
};
const errManageRoles = guild => () => {
	permWarn(guild, "manage roles, above mine or otherwise");
};
const sendHelp = (msg, perm) => {
	const noGuild = !msg.guild;
	const permOrNoGuild = perm || noGuild;
	let help = `${noGuild ? "" : `${msg.author} `}You can use the following commands.${(noGuild || data.guilds[msg.guild.id][0] || perm) ? `\n\n\`>🎨color <hex color code>\`\nSet your color${permOrNoGuild ? ", if open color mode is enabled" : ""}.\n\n\`>🎨reset\`\nReset your color role${permOrNoGuild ? ", if open color mode is enabled" : ""}.` : ""}\n\n\`>🎨list\`\nList all role groups and their roles.\n\n\`>🎨add <role name>\`\nGive yourself a role.\n\n\`>🎨remove <role name>\`\nRemove a role from yourself.`;
	if(permOrNoGuild) {
		help += "\n\nWith administrative permission, you can use the following commands.\n\n`>🎨open`\nToggle open color mode. This is disabled by default.\n\n`>🎨create <group name>`\nCreate a role group.\n\n`>🎨group <group name> <role name>`\nAdd a role to a role group.\n\n`>🎨ungroup <role name>`\nRemove a role from its role group.\n\n`>🎨limit <group name> <number>`\nLimit how many roles each user can have from a certain group. (This defaults to 1 for each group. Set to 0 to remove the limit.)\n\n`>🎨rename <group name> <new group name>`\nRename a role group.\n\n`>🎨delete <group name>`\nDelete a role group.";
	}
	help += "\n\nTo invite me to one of your own Discord servers, you can go to <https://miroware.io/discord/colorbot/>.";
	msg.channel.send(help).catch(errSendMessages(msg));
};
const present = () => {
	client.user.setPresence({
		status: "online"
	});
	client.user.setActivity('Enter ">🎨" for info.');
};
client.once("ready", () => {
	for(const [id] of client.guilds) {
		if(!data.guilds[id]) {
			guildCreate(id);
		}
	}
	for(const id of Object.keys(data.guilds)) {
		const guild = client.guilds.get(id);
		if(guild) {
			for(const group of Object.keys(data.guilds[id][1])) {
				data.guilds[id][1][group][1] = data.guilds[id][1][group][1].filter(guild.roles.get.bind(guild.roles));
			}
			for(const [, role] of guild.roles) {
				if(properColorTest.test(role.name) && role.members.size === 0) {
					role.delete().catch(errManageRoles(guild));
				}
			}
		}
	}
	save();
	setInterval(present, 60000);
	present();
});
client.on("guildCreate", ({id}) => {
	if(!data.guilds[id]) {
		guildCreate(id);
		save();
	}
});
client.on("guildMemberRemove", member => {
	if(member.guild.available) {
		for(const [, role] of member.roles) {
			if(properColorTest.test(role.name) && role.members.size === 0) {
				role.delete().catch(errManageRoles(member.guild));
				break;
			}
		}
	}
});
client.on("roleDelete", role => {
	if(role.guild.available) {
		for(const [, roles] of Object.values(data.guilds[role.guild.id][1])) {
			const roleIndex = roles.indexOf(role.id);
			if(roleIndex !== -1) {
				roles.splice(roleIndex, 1);
				save();
				break;
			}
		}
	}
});
const setColor = (member, color, role, msg) => {
	member.roles.add(role).catch(errManageRoles(msg.guild));
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
	for(const [, role] of member.roles) {
		if(properColorTest.test(role.name)) {
			return role.members.size > 1 ? member.roles.remove(role) : role.delete();
		}
	}
	return Promise.resolve();
};
const ungroup = (id, role) => {
	let found = false;
	for(const group of Object.keys(data.guilds[id][1])) {
		const roleIndex = data.guilds[id][1][group][1].indexOf(role);
		if(roleIndex !== -1) {
			data.guilds[id][1][group][1].splice(roleIndex, 1);
			found = true;
			break;
		}
	}
	return found;
};
client.on("message", async msg => {
	if(msg.system) {
		return;
	}
	if(msg.channel.type === "text") {
		let content = msg.content;
		if(prefix.test(content)) {
			const member = msg.guild.member(msg.author) || await msg.guild.members.fetch(msg.author);
			const perm = member.hasPermission(8) || member.id === "152282430915608578";
			content = content.replace(prefix, "");
			if(content) {
				content = content.replace(spaces, " ");
				const spaceIndex = content.indexOf(" ");
				if(spaceIndex === -1) {
					content = [content, ""];
				} else {
					content = [content.slice(0, spaceIndex), content.slice(spaceIndex + 1)];
				}
				content[0] = content[0].toLowerCase();
				const contentIsColor = content[0] === "color" || content[0] === "colour";
				if(contentIsColor || content[0] === "reset") {
					if(data.guilds[msg.guild.id][0] === 0) {
						msg.channel.send(`${msg.author} This command is unavailable, as open color mode is disabled.${perm ? ' With administrative permission, you can enable it by entering ">🎨open".' : ""}`).catch(errSendMessages(msg));
					} else if(contentIsColor) {
						if(content[1]) {
							if(colorTest.test(content[1])) {
								content[1] = content[1].replace(colorTest, "#$1$1$2$2$3$3$4").toLowerCase();
								const addColorRole = () => {
									const currentRole = msg.guild.roles.find(role => role.name === content[1]) || msg.guild.roles.find(role => role.name.toLowerCase() === content[1].toLowerCase());
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
												for(const [, role] of msg.guild.roles) {
													if(properColorTest.test(role.name)) {
														const redDiff = parseInt(role.name.slice(1, 3), 16) - red;
														const greenDiff = parseInt(role.name.slice(3, 5), 16) - green;
														const blueDiff = parseInt(role.name.slice(5, 7), 16) - blue;
														colors.push([role, redDiff * redDiff + greenDiff * greenDiff + blueDiff * blueDiff]);
													}
												}
												msg.channel.send(`${msg.author} The maximum role limit has been reached and no more color roles can be created. If you want, you can choose a color that someone else is already using. Below are some similar colors I found to the one you entered.`, {
													embed: {
														description: colors.sort(byColorDiff).slice(0, 20).map(byRoles).join(" "),
														color: parseInt(content[1].slice(1), 16)
													}
												}).catch(errEmbedLinks(msg));
											}
										});
									}
								};
								removeColor(member).then(addColorRole).catch(errManageRoles(msg.guild));
							} else {
								msg.channel.send(`${msg.author} That's not a valid hex color code! If you don't know how hex color codes work, Google has a color picker built into the search page if you search "color picker".`).catch(errSendMessages(msg));
							}
						} else {
							msg.channel.send(`${msg.author} No color code was specified.`).catch(errSendMessages(msg));
						}
					} else if(content[0] === "reset") {
						removeColor(member).then(() => {
							msg.channel.send(`${msg.author} Your color role has been reset.`).catch(errSendMessages(msg));
						}).catch(errManageRoles(msg.guild));
					}
				} else if(content[0] === "list") {
					if(Object.keys(data.guilds[msg.guild.id][1]).length) {
						const fields = [];
						for(const group of Object.keys(data.guilds[msg.guild.id][1])) {
							fields.push({
								name: `${group} (${data.guilds[msg.guild.id][1][group][0] ? `limit: ${data.guilds[msg.guild.id][1][group][0]}` : "no limit"})`,
								value: data.guilds[msg.guild.id][1][group][1].length ? data.guilds[msg.guild.id][1][group][1].map(msg.guild.roles.get.bind(msg.guild.roles)).join(" ") : "(empty)"
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
						const contentRole = msg.guild.roles.find(role => role.name === content[1]) || msg.guild.roles.find(role => role.name.toLowerCase() === content[1].toLowerCase());
						if(contentRole) {
							let found = false;
							for(const group of Object.keys(data.guilds[msg.guild.id][1])) {
								const roleIndex = data.guilds[msg.guild.id][1][group][1].indexOf(contentRole.id);
								if(roleIndex !== -1) {
									if(member.roles.has(contentRole.id)) {
										msg.channel.send(`${msg.author} You already have that role.`).catch(errSendMessages(msg));
									} else {
										let has = 0;
										if(data.guilds[msg.guild.id][1][group][0]) {
											for(const role of data.guilds[msg.guild.id][1][group][1]) {
												if(member.roles.has(role)) {
													if(data.guilds[msg.guild.id][1][group][0] === 1) {
														member.roles.remove(role);
													} else {
														has++;
													}
												}
											}
										}
										if(data.guilds[msg.guild.id][1][group][0] <= 1 || has < data.guilds[msg.guild.id][1][group][0]) {
											member.roles.add(contentRole).then(() => {
												msg.channel.send(`${msg.author} ${data.guilds[msg.guild.id][1][group][0] === 1 ? `Your ${italicize(group)} role has been set to ${italicize(contentRole.name)}.` : `The ${italicize(contentRole.name)} role has been added to your ${italicize(group)} roles.`}`).catch(errSendMessages(msg));
											}).catch(errManageRoles(msg.guild));
										} else {
											msg.channel.send(`${msg.author} You already have ${has} ${italicize(group)} roles, so you need to remove one to add another.`).catch(errSendMessages(msg));
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
						const contentRole = msg.guild.roles.find(role => role.name === content[1]) || msg.guild.roles.find(role => role.name.toLowerCase() === content[1].toLowerCase());
						if(contentRole) {
							let found = false;
							for(const [, role] of Object.values(data.guilds[msg.guild.id][1])) {
								const roleIndex = role.indexOf(contentRole.id);
								if(roleIndex !== -1) {
									if(member.roles.has(contentRole.id)) {
										member.roles.remove(contentRole).then(() => {
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
						msg.channel.send(`${msg.author} Open color mode has been ${(data.guilds[msg.guild.id][0] = +!data.guilds[msg.guild.id][0]) ? "enabled" : "disabled"}.`).catch(errSendMessages(msg));
						save();
					} else if(content[0] === "create") {
						if(content[1]) {
							if(content[1].includes(" ")) {
								msg.channel.send(`${msg.author} Group names cannot contain spaces.`).catch(errSendMessages(msg));
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
									content[1] = content[1].slice(spaceIndex2 + 1);
									const contentRole = msg.guild.roles.find(role => role.name === content[1]) || msg.guild.roles.find(role => role.name.toLowerCase() === content[1].toLowerCase());
									if(contentRole) {
										if(group[1].includes(contentRole.id)) {
											msg.channel.send(`${msg.author} That role is already in that group.`).catch(errSendMessages(msg));
										} else {
											const found = ungroup(msg.guild.id, contentRole.id);
											group[1].push(contentRole.id);
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
							const contentRole = msg.guild.roles.find(role => role.name === content[1]) || msg.guild.roles.find(role => role.name.toLowerCase() === content[1].toLowerCase());
							if(contentRole) {
								if(ungroup(msg.guild.id, contentRole.id)) {
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
	} else if(prefix.test(msg.content)) {
		sendHelp(msg);
	}
});
client.login(data.token);
fs.watch(__filename, () => {
	process.exit();
});
require("replthis")(v => eval(v));
