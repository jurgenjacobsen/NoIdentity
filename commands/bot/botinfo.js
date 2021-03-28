const i18n = require('i18n');

exports.run = async (Discord, client, message, args, i18n) => {
	const bot_invite = client.config.website.invite;
	const support_guild = client.config.website.support_server_invite;
	const bot_description = client.config.website.description;
    const patreon_link = client.config.website.patreon;

	const Embed = new Discord.MessageEmbed()
	.setColor(client.config.color)
	.setAuthor(client.user.username, client.user.displayAvatarURL())
	.setDescription(i18n.__("command.botinfo.responses.description"))
	.addField('Links:', [
		`${i18n.__mf("command.botinfo.responses.links", {support_guild: support_guild, bot_invite: bot_invite, patreon_link: patreon_link, website: 'https://noid.one'})}`,
		'\u200b'
	])
	.addField(`${i18n.__("command.botinfo.responses.extrainfo.title")}`, [
		`${i18n.__mf("command.botinfo.responses.extrainfo.description", { bot_owner: client.users.cache.get(client.config.ownerID).tag })}`
	])

	message.channel.send(message.author, Embed);
};

exports.config = {
    name: 'botinfo',
    enabled: true,
	guildOnly: false,
	aliases: ['info'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'info',
	category: "Bot",
    description: "Mostra as informações do bot.",
    usage: "botinfo"
};