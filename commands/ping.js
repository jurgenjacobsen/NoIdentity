exports.run = async (Discord, client, message, args) => {
	const Embed = new Discord.MessageEmbed()
  .setColor(client.config.color)
  .setDescription(`🏓 Minha latência ${Date.now() - message.createdTimestamp}ms. Latência do API ${Math.round(client.ws.ping)}ms.`)
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