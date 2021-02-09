exports.run = async (Discord, client, message, args) => {
	
	const bot_invite = client.config.website.invite;
	const support_guild = client.config.website.support_server_invite;
	const bot_description = client.config.website.description;
    const patreon_link = client.config.website.patreon;

	const Embed = new Discord.MessageEmbed()
	.setColor(client.config.color)
	.setAuthor(client.user.username, client.user.displayAvatarURL())
	.setDescription(bot_description)
	.addField('Links:', [
		`[Servidor de Suporte](${support_guild}) | [Me Adicionar](${bot_invite}) | [Patreon](${patreon_link})`,
		'\u200b'
	])
	.addField('Informações Extras:', [
		`Desenvolvedor: **${client.users.cache.get(client.config.ownerID).tag}** | Fui Criado Em: **18/11/2020**`
	])

	message.channel.send(message.author, Embed);
};

exports.config = {
    name: 'info',
    enabled: true,
	guildOnly: false,
	aliases: ['botinfo'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'info',
	category: 'Bot',
	description: 'Mostra as informações do bot.',
	usage: 'info'
};