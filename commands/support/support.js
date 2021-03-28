exports.run = async (Discord, client, message, args, i18n) => {
	message.author.send('https://noid.one/support');
};

exports.config = {
    name: 'support',
    enabled: false,
	guildOnly: false,
    aliases: [],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'support',
	category: 'Suporte',
	description: 'Contate o suporte do bot',
	usage: 'support'
};