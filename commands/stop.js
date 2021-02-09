exports.run = async (Discord, client, message, args) => {
	const serverQueue = client.queue.get(message.guild.id);
    client.stop(message, serverQueue);
};

exports.config = {
    name: 'stop',
    enabled: true,
	guildOnly: true,
    aliases: [],
    permissions: ['SEND_MESSAGES', 'CONNECT', 'SPEAK']
};

exports.help = {
	name: 'stop',
	category: 'Música',
	description: 'Limpa a lista de reprodução de músicas',
	usage: 'stop'
};