exports.run = async (Discord, client, message, args) => {
	
};

exports.config = {
    name: 'nowplaying',
    enabled: true,
	guildOnly: true,
    aliases: ['np'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'nowplaying',
	category: 'Música',
	description: 'Mostra a musica que esta tocando',
	usage: 'nowplaying'
};