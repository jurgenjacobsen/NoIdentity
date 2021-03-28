const { canModifyQueue} = require("../../modules/music.js");

exports.run = async (Discord, client, message, args, i18n) => {

    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.channel.send(client.embed(i18n.__("command.stop.errors.noqueue"))).catch(console.error);
    if (!canModifyQueue(message.member)) return message.channel.send(client.embed(i18n.__("command.stop.errors.notinsamechannel")));

    queue.songs = [];
    queue.connection.dispatcher.end();
    let stopEmbed = new Discord.MessageEmbed()
    .setColor("#8855ff")
    .setDescription(i18n.__("modules.utilPlay.thanks"))
    .addField(i18n.__("modules.utilPlay.likeMe"), i18n.__("modules.utilPlay.stoppedNonPremium"))
    .setImage("https://noid.one/assets/images/patreon_banner_noid.png");
    queue.textChannel.send(message.author, stopEmbed).catch(console.error);
};

exports.config = {
    name: 'stop',
    enabled: true,
	guildOnly: true,
    aliases: [],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'stop',
	category: 'Música',
	description: 'Para a música e limpa a lista de reprodução.',
	usage: 'stop'
};