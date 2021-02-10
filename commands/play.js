exports.run = async (Discord, client, message, args) => {
	const serverQueue = client.queue.get(message.guild.id);
    client.execute(message, serverQueue, args.join(' '));
};

exports.config = {
    name: 'play',
    enabled: true,
	guildOnly: true,
    aliases: ['p', 'tocar'],
    permissions: ['SEND_MESSAGES', 'CONNECT', 'SPEAK']
};

exports.help = {
	name: 'play',
	category: 'Música',
	description: 'Toca uma música pra você!',
	usage: 'play {nome-do-video}'
};