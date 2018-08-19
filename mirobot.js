"use strict";
console.log("< Mirobot >");
const fs = require("fs");
const Discord = require("discord.js");
const doNothing = () => {};
let data;
const load = () => {
	data = JSON.parse(fs.readFileSync("secret/mirobot.json"));
};
load();
const save = () => {
	fs.writeFileSync("secret/mirobot.json", JSON.stringify(data));
};
const client = new Discord.Client();
const exitOnError = err => {
	console.error(err);
	process.exit(1);
};
process.once("unhandledRejection", exitOnError);
client.once("error", exitOnError);
client.once("disconnect", exitOnError);
let guild;
client.once("ready", () => {
	guild = client.guilds.get("343250948233101312");
	client.user.setPresence({
		status: "online"
	});
	client.user.setActivity("with magic");
});
const prefix = /^> ?/;
client.on("message", async msg => {
	if(msg.author.bot) {
		return;
	}
	const isPublic = msg.channel.type === "text";
	let content = msg.content;
	if(isPublic) {
		const member = msg.guild.member(msg.author) || await msg.guild.members.fetch(msg.author);
		const perm = member.hasPermission(8);
		if(prefix.test(content)) {
			content = content.replace(prefix, "");
			const contentSpaceIndex = content.indexOf(" ");
			const contentLineIndex = content.indexOf("\n");
			const contentIndex = Math.min((contentSpaceIndex !== -1) ? contentSpaceIndex : Infinity, (contentLineIndex !== -1) ? contentLineIndex : Infinity);
			if(contentIndex !== Infinity) {
				content = [content.slice(0, contentIndex), content.slice(contentIndex + 1)];
			} else {
				content = [content];
			}
			content[0] = content[0].toLowerCase();
			if(perm) {
				if(content[0] === "say") {
				   msg.delete().then(() => {
					   msg.channel.send(content[1]).catch(doNothing);
				   });
			   } else if(content[0] === "delete") {
				   msg.delete().then(() => {
					   const messages = parseInt(content[1]);
					   if(!isNaN(content[1])) {
						   msg.channel.bulkDelete(parseInt(content[1])).catch(doNothing);
					   }
				   });
			   } else if(content[0] === "react") {
					const emojis = content[1].split(" ");
					msg.channel.messages.fetch({
						limit: 1,
						before: msg.id
					}).then(msgs => {
						const msg2 = msgs.first();
						for(const emoji of emojis) {
							if(emoji) {
								msg2.react(emoji).catch(doNothing);
							}
						}
						msg.delete();
					});
				}
			}
		}
	}
});
client.login(data.token);
fs.watch(__filename, () => {
	process.exit();
});
require("replthis")(v => eval(v));
