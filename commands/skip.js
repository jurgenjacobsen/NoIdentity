exports.run = async (Discord, client, message, args) => {
	const serverQueue = client.queue.get(message.guild.id);
    client.skip(message, serverQueue);
};

exports.config = {
    name: 'skip',
    enabled: true,
	guildOnly: true,
    aliases: [],
    permissions: ['SEND_MESSAGES', 'CONNECT', 'SPEAK']
};

exports.help = {
	name: 'skip',
	category: 'Música',
	description: 'Passa a música que estiver tocando',
	usage: 'skip'
};