
exports.run = async (Discord, client, message, args, i18n) => {
    message.channel.send(message.author, client.embed("https://noid.one/"))
};

exports.config = {
    name: 'site',
    enabled: true,
	guildOnly: false,
	aliases: ['website'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'site',
	category: "Bot",
    description: "Mostra o site do bot.",
    usage: "site"
};