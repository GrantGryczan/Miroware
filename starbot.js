console.log("< Starbot >");
var fs = require("fs");
var Discord = require("discord.js");
var colorTest = /^#?(?:([\da-f])([\da-f])([\da-f])|([\da-f]{6}))$/i;
var channelTest = /^<#(\d+)>$/;
var data;
var load = function() {
	data = JSON.parse(fs.readFileSync("data/starbot.json"));
};
load();
var save = function() {
	fs.writeFileSync("data/starbot.json", JSON.stringify(data));
};
var client = new Discord.Client();
client.once("error", process.exit);
client.once("disconnect", process.exit);
var warn = function(guild, perms) {
	var warning = ", likely because I do not have permission to " + perms + ". It is recommended that you enable these permissions for me in attempt to resolve this error.";
	guild.owner.send("An error occured on " + guild.name + warning).catch(function() {
		warning = guild.owner + " An error occured" + warning;
		var channels = Array.from(guild.channels.values());
		var i = 0;
		var testChannel = function() {
			channels[i].send(warning).catch(function() {
				i++;
				testChannel();
			});
		};
		testChannel();
	});
};
var guildCreate = function(guild) {
	console.log("guildCreate " + guild.id);
	/*
	guild.createChannel("starboard", "text", [{
		type: "role",
		id: guild.defaultRole.id,
		deny: 2048
	}, {
		type: "member",
		id: client.user.id,
		allow: 268446736,
		deny: 131072
	}]).then(function(channel) {
		data.guilds[guild.id] = [channel.id, "%E2%AD%90", 5, 16755763];
		save();
	}).catch(function() {
		warn(guild, "manage channels");
	});
	*/
	
};
var guildDelete = function(guild) {
	console.log("guildDelete " + guild.id);
	delete data.guilds[guild.id];
	save();
}
client.once("ready", function() {
	client.user.setPresence({
		status: "online"
	});
	client.user.setActivity("Enter \">⭐\" for info.");
	var guilds = Array.from(client.guilds.keys());
	for(var i = 0; i < guilds.length; i++) {
		var guild = client.guilds.get(guilds[i]);
		if(data.guilds[guilds[i]]) {
			if(!guild.channels.get(data.guilds[guilds[i]][0])) {
				guild.leave();
			}
		} else {
			guildCreate(guild);
		}
	}
	for(var i in data.guilds) {
		if(guilds.indexOf(i) == -1) {
			guildDelete(i);
		} else if(!data.guilds[i][1]) {
			data.guilds[i][1] = "%E2%AD%90";
		}
	}
	save();
});
client.on("guildCreate", guildCreate);
client.on("guildDelete", guildDelete);
client.on("channelDelete", function(channel) {
	if(channel.id == data.guilds[channel.guild.id][0]) {
		channel.guild.leave();
	}
});
var starred = [];
var star = function(msg, callback) {
	if(starred.indexOf(msg.id) == -1) {
		starred.push(msg.id);
	}
	var embed = {
		embed: {
			timestamp: msg.createdAt.toISOString(),
			color: data.guilds[msg.guild.id][3],
			footer: {
				text: decodeURIComponent(data.guilds[msg.guild.id][1]) + " | " + msg.id
			},
			fields: [
				{
					name: "Author",
					value: msg.author.toString(),
					inline: true
				},
				{
					name: "Channel",
					value: msg.channel.toString(),
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
	var attachment = msg.attachments.first();
	if(attachment) {
		embed.embed.image = {
			url: attachment.url
		};
	}
	var starboard = msg.guild.channels.get(data.guilds[msg.guild.id][0]);
	starboard.send(embed).then(callback).catch(function(err) {
		warn(msg.guild, "read messages, send messages, " + (attachment ? "and/or embed links" : "embed links, and/or attach files") + ", in the " + starboard + " channel or otherwise");
	});
};
client.on("messageReactionAdd", function(reaction) {
	if(starred.indexOf(reaction.message.id) == -1 && data.guilds[reaction.message.guild.id] && reaction.message.channel.id != data.guilds[reaction.message.guild.id][0] && reaction.emoji.identifier == data.guilds[reaction.message.guild.id][1] && reaction.count >= data.guilds[reaction.message.guild.id][2]) {
		star(reaction.message);
	}
});
var prefix = /^> ?⭐/;
client.on("message", function(msg) {
	if(msg.channel.type == "text" && !msg.system) {
		var content = msg.content;
		if(prefix.test(content)) {
			var member = msg.guild.member(msg.author);
			var perm = member.hasPermission(8);
			var sendHelp = function() {
				var help = msg.author + " You can add " + data.guilds[msg.guild.id][2] + " " + decodeURIComponent(data.guilds[msg.guild.id][1]) + " " + ((data.guilds[msg.guild.id][2] == 1) ? "reaction" : "reactions") + " to a message on this server to add it to the <#" + data.guilds[msg.guild.id][0] + "> channel.";
				if(perm) {
					help += "\nAs a member of this Discord server with administrative permission, you can enter \">⭐\" with, after it, a number to define how many reactions should get messages starred, an emoji (not custom) to define which emoji should be used to star messages, a hexademical color code to change the starred embed color, a channel tag to switch the starboard channel (not recommended), or a message ID to star that message manually.\nYou can also prevent me from scanning messages and accepting commands in a certain channel by adding me to its channel permissions and disabling my permission to read messages (except for in the starboard channel, which already has this disabled by default).";
				}
				help += "\nTo invite me to one of your own Discord servers, you can go to <https://miroware.io/discord/starbot/>.";
				msg.channel.send(help).catch(function() {
					warn(msg.guild, "send messages, in the " + msg.channel + " channel or otherwise");
				});
			};
			if(perm) {
				content = content.replace(prefix, "").replace(/ /g, "");
				if(content) {
					var old1 = data.guilds[msg.guild.id][1];
					data.guilds[msg.guild.id][1] = null;
					msg.react(content).then(function(reaction) {
						reaction.remove(client.user).then(function() {
							data.guilds[msg.guild.id][1] = reaction.emoji.identifier;
							save();
							msg.channel.send(msg.author + " Members now have to react with the " + content + " emoji to get a message starred.").catch(function() {
								warn(msg.guild, "send messages, in the " + msg.channel + " channel or otherwise");
							});
						});
					}).catch(function() {
						data.guilds[msg.guild.id][1] = old1;
						save();
						msg.channel.messages.fetch(content).then(function(msg2) {
							star(msg2, function() {
								msg.channel.send(msg.author + " Message `" + msg2.id + "` has been starred.").catch(function() {
									warn(msg.guild, "send messages, in the " + msg.channel + " channel or otherwise");
								});
							});
						}).catch(function() {
							if(channelTest.test(content)) {
								var channel = content.replace(channelTest, "$1");
								if(msg.guild.channels.get(channel)) {
									data.guilds[msg.guild.id][0] = channel;
									save();
									msg.channel.send(msg.author + " The starboard channel has been set to " + content + ".").catch(function() {
										warn(msg.guild, "send messages, in the " + msg.channel + " channel or otherwise");
									});
								} else {
									msg.channel.send(msg.author + " That channel does not exist, or I do not have permission read messages in it.").catch(function() {
										warn(msg.guild, "send messages, in the " + msg.channel + " channel or otherwise");
									});
								}
							} else {
								var reactionCount = parseInt(content);
								if(reactionCount) {
									data.guilds[msg.guild.id][2] = Math.abs(reactionCount);
									save();
									msg.channel.send(msg.author + " Members now have to add " + data.guilds[msg.guild.id][2] + " " + ((data.guilds[msg.guild.id][2] == 1) ? "reaction" : "reactions") + " to get a message starred.").catch(function() {
										warn(msg.guild, "send messages, in the " + msg.channel + " channel or otherwise");
									});
								} else if(colorTest.test(content)) {
									var code = content.replace(colorTest, "$1$1$2$2$3$3$4");
									data.guilds[msg.guild.id][3] = parseInt(code, 16);
									save();
									msg.channel.send("The starred embed color has been changed to `#" + code + "`.\n(The default starred embed color is `#ffac33`.)", {
										embed: {
											title: "#" + code,
											color: data.guilds[msg.guild.id][3]
										}
									}).catch(function() {
										warn(msg.guild, "send messages or embed links, in the " + msg.channel + " channel or otherwise");
									});
								} else {
									sendHelp();
								}
							}
						});
					});
				} else {
					sendHelp();
				}
			} else {
				sendHelp();
			}
		}
	}
});
client.login(data.token);
fs.watch(__filename, function(type) {
	process.exit();
});
var stdin = process.openStdin();
stdin.on("data", function(input) {
	console.log(eval(input.toString().trim()));
});
