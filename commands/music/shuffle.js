const { canModifyQueue} = require("../../modules/music.js");

exports.run = async (Discord, client, message, args, i18n) => {
	const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(client.embed(i18n.__("command.shuffle.errors.noqueue"))).catch(console.error);
    if (!canModifyQueue(message.member)) return message.channel.send(client.embed(i18n.__("command.shuffle.errors.notinsamechannel")));

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    queue.textChannel.send(client.embed(`${message.author} ${i18n.__("command.shuffle.responses.description")}`).setColor('#8855ff')).catch(console.error);
};

exports.config = {
    name: 'shuffle',
    enabled: true,
	guildOnly: true,
    aliases: [],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'shuffle',
	category: 'Música',
	description: 'Ativa o modo aleatório de reprodução',
	usage: 'shuffle'
};