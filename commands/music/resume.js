const { canModifyQueue} = require("../../modules/music.js");

exports.run = async (Discord, client, message, args, i18n) => {

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(client.embed(i18n.__("command.resume.errors.noqueue"))).catch(console.error);
    if (!canModifyQueue(message.member)) return message.channel.send(client.embed(i18n.__("command.resume.errors.notsamechannel")));

    if (!queue.playing) {
        queue.playing = true;
        queue.connection.dispatcher.resume();
        return queue.textChannel
        .send(client.embed(`${message.author} ${i18n.__("command.resume.responses.description")}`).setColor('#8855ff'))
        .catch(console.error);
    }

    return message.channel.send(client.embed(i18n.__("command.resume.errors.notpaused"))).catch(console.error);
};

exports.config = {
    name: 'resume',
    enabled: true,
	guildOnly: true,
    aliases: ['r'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'resume',
	category: 'Música',
	description: 'Reproduz novamente a música pausada.',
	usage: 'resume'
};