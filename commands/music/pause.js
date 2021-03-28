const { canModifyQueue} = require("../../modules/music.js");

exports.run = async (Discord, client, message, args, i18n) => {
	const queue = message.client.queue.get(message.guild.id);
	let Notqueue = client.embed(i18n.__("command.pause.errors.noqueue"))

	let NotInsamechannel = client.embed(i18n.__("command.pause.errors.notinsamechannel"))

	let emb = client.embed(`${message.author} ${i18n.__("command.pause.responses.paused")}`).setColor('#8855ff');

    if (!queue) return message.channel.send(message.author, Notqueue).catch(console.error);
    if (!canModifyQueue(message.member)) return message.channel.send(message.author, NotInsamechannel)

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel
        .send(emb)
    	.catch(console.error);
    } 
};

exports.config = {
    name: 'pause',
    enabled: true,
	guildOnly: true,
    aliases: [],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'pause',
	category: 'Música',
	description: 'Pausa a música reproduzindo.',
	usage: 'pause'
};