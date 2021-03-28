exports.run = async (Discord, client, message, args, i18n) => {
	const Embed = client.embed(i18n.__mf("command.ping.responses.description", {
    ping: Date.now() - message.createdTimestamp,
    api_ping: Math.round(client.ws.ping),
  }))
  message.channel.send(message.author, Embed);
};

exports.config = {
    name: 'ping',
    enabled: true,
	  guildOnly: false,
    aliases: [],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'ping',
	category: 'Bot',
	description: 'Mostra a latência do bot',
	usage: 'ping'
};