const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;
const { canModifyQueue} = require("../../modules/music.js");

exports.run = async (Discord, client, message, args, i18n) => {

    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.channel.send(client.embed(i18n.__("command.remove.errors.noqueue"))).catch(console.error);
    if (!canModifyQueue(message.member)) return message.channel.send(client.embed(i18n.__("command.remove.errors.notsamechannel")));
    if (!args.length) return message.channel.send(client.embed(i18n.__mf("command.remove.errors.noargs", { prefix: client.config.prefix })));
	
	const arguments = args.join("");
    const songs = arguments.split(",").map((arg) => parseInt(arg));
    let removed = [];

	if (pattern.test(arguments)) {
		queue.songs = queue.songs.filter((item, index) => {
			if (songs.find((songIndex) => songIndex - 1 === index)) removed.push(item);
		  	else return true;
		});
  
		queue.textChannel.send(client.embed(`${message.author} ${i18n.__mf("command.remove.responses.first_response", {
			x: removed.map((song) => song.title).join("\n")
		})}`).setColor('#8855ff'));
	} else if (!isNaN(args[0]) && args[0] >= 1 && args[0] <= queue.songs.length) {
		return queue.textChannel.send(client.embed(`${message.author} ${i18n.__mf("command.remove.responses.first_response", {
			x: queue.songs.splice(args[0] - 1, 1)[0].title,
		})}`).setColor('#8855ff'));
	} else {
		return message.channel.send(client.embed(i18n.__("command.remove.errors.noargs")));
	}
};

exports.config = {
    name: 'remove',
    enabled: true,
	guildOnly: true,
    aliases: ['rm'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'remove',
	category: 'Música',
	description: 'Remove música da playlist',
	usage: 'remove {número da música na playlist}'
};