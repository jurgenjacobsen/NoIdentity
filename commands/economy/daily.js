
exports.run = async (Discord, client, message, args, i18n) => {

   await client.economy.checkForDaily(message.guild.id, message.author.id, i18n, message);

};

exports.config = {
    name: 'daily',
    enabled: true,
	guildOnly: true,
    aliases: ['diária', 'diaria'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'daily',
	category: "Economia",
    description: "Pega sua diária",
    usage: "daily"
};