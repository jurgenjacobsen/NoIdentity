const { canModifyQueue} = require("../../modules/music.js");

exports.run = async (Discord, client, message, args, i18n) => {

    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.channel.send(client.embed(i18n.__("command.volume.errors.noqueue"))).catch(console.error);
    if (!canModifyQueue(message.member)) return message.channel.send(client.embed(i18n.__("command.volume.errors.notinsamechannel"))).catch(console.error);

    if (!args[0]) return message.channel.send(client.embed(i18n.__mf("command.volume.errors.noargs", {actualVolume: queue.volume}))).catch(console.error);
    if (isNaN(args[0])) return message.channel.send(client.embed(i18n.__("command.volume.errors.isNaN"))).catch(console.error);
    if (Number(args[0]) > 100 || Number(args[0]) < 0)
    return message.channel.send(client.embed(i18n.__("command.volume.errors.isNaN"))).catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    return queue.textChannel.send(client.embed(`${message.author} ${i18n.__mf("command.volume.responses.description", {
      volumeX: args[0]
    })}`).setColor('#8855ff')).catch(console.error);
};

exports.config = {
  name: 'volume',
  enabled: true,
	guildOnly: true,
  aliases: [],
  permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'volume',
	category: 'Música',
	description: 'Altera o volume da música tocando',
	usage: 'volume 0/100'
};