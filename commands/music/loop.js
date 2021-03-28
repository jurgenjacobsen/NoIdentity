const { canModifyQueue } = require("../../modules/music.js");

exports.run = async (Discord, client, message, args, i18n) => {

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(client.embed(i18n.__("command.loop.errors.noqueue"))).catch(console.error);
    if (!canModifyQueue(message.member)) return message.channel.send(client.embed(i18n.__("command.loop.errors.notsamechannel")));

    queue.loop = !queue.loop;
    return queue.textChannel
    .send(client.embed(`${message.author}` + i18n.__mf("command.loop.responses.res", { mode: queue.loop ? `${i18n.__("command.loop.responses.modes.on")}` : `${i18n.__(i18n.__("command.loop.responses.modes.off"))}` })).setColor('#8855ff'))
    .catch(console.error);
};

exports.config = {
    name: 'loop',
    enabled: true,
	guildOnly: true,
    aliases: ['l'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'loop',
	category: 'Música',
	description: 'Ativa o modo de repetição.',
	usage: 'loop'
};