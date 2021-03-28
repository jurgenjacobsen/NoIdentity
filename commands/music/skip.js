const { canModifyQueue} = require("../../modules/music.js");

exports.run = async (Discord, client, message, args, i18n) => {

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(client.embed(i18n.__("command.skip.errors.noqueue"))).catch(console.error);
    if (!canModifyQueue(message.member)) return message.channel.send(client.embed(i18n.__("command.skip.errors.notinsamechannel")));

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(client.embed(`${message.author} ${i18n.__("command.skip.responses.description")}`).setColor('#8855ff')).catch(console.error);
};

exports.config = {
    name: 'skip',
    enabled: true,
	guildOnly: true,
    aliases: ['s'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'skip',
	category: 'Música',
	description: 'Pula a música atual',
	usage: 'skip'
};