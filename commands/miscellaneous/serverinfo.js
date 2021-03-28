exports.run = async (Discord, client, message, args, i18n) => {
	const g = message.guild;
	const moment = require('moment');

	moment.locale('pt-br');
	const regions = {
		'brazil': `${i18n.__("command.serverinfo.responses.regions.brazil")} :flag_br:`,
		'europe': `${i18n.__("command.serverinfo.responses.regions.europe")} :flag_eu:`,
		'hongkong': `${i18n.__("command.serverinfo.responses.regions.hongkong")} :flag_hk:`,
		'india': `${i18n.__("command.serverinfo.responses.regions.india")} :flag_in:`,
		'japan': `${i18n.__("command.serverinfo.responses.regions.japan")} :flag_jp:`,
		'russia': `${i18n.__("command.serverinfo.responses.regions.russia")} :flag_ru:`,
		'singapore': `${i18n.__("command.serverinfo.responses.regions.singapore")} :flag_sg:`,
		'southafrica': `${i18n.__("command.serverinfo.responses.regions.southafrica")} :flag_za:`,
		'sydney': `${i18n.__("command.serverinfo.responses.regions.sydney")} :flag_au:`,
		'us-central': `${i18n.__("command.serverinfo.responses.regions.us-central")} :flag_us:`,
		'us-east': `${i18n.__("command.serverinfo.responses.regions.us-east")} :flag_us:`,
		'us-west': `${i18n.__("command.serverinfo.responses.regions.us-west")} :flag_us:`,
		'us-south': `${i18n.__("command.serverinfo.responses.regions.us-south")} :flag_us:`
	};

	const filterLevels = {
		DISABLED: i18n.__("command.serverinfo.responses.filterLevels.DISABLED"),
		MEMBERS_WITHOUT_ROLES: i18n.__("command.serverinfo.responses.filterLevels.MEMBERS_WITHOUT_ROLES"),
		ALL_MEMBERS: i18n.__("command.serverinfo.responses.filterLevels.ALL_MEMBERS")
	};
	
	const verificationLevels = {
		NONE: i18n.__("command.serverinfo.responses.verificationLevels.NONE"),
		LOW: i18n.__("command.serverinfo.responses.verificationLevels.LOW"),
		MEDIUM: i18n.__("command.serverinfo.responses.verificationLevels.MEDIUM"),
		HIGH: i18n.__("command.serverinfo.responses.verificationLevels.HIGH"),
		VERY_HIGH: i18n.__("command.serverinfo.responses.verificationLevels.VERY_HIGH")
	};

	const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
	const members = message.guild.members.cache;
	const channels = message.guild.channels.cache;
	const emojis = message.guild.emojis.cache;

	let owner;
	await client.users.fetch(message.guild.ownerID).then(u => {
		owner = u;
	});

	const ServerInfo = new Discord.MessageEmbed()
	.setTitle(g.name)
	.setThumbnail(message.guild.iconURL({ dynamic: true }))
	.setColor(client.config.color)
	.addField(i18n.__("command.serverinfo.responses.embed.title"), [
		`**<:paper_icon:794273334615080982> ${i18n.__("command.serverinfo.responses.embed.name")}:** ${message.guild.name}`,
		`**▹ ${i18n.__("command.serverinfo.responses.embed.id")}:** ${message.guild.id}`,
		`**▹ ${i18n.__("command.serverinfo.responses.embed.region")}:** ${regions[message.guild.region]}\n`,
		`**<:staff_icon:796577477945851936> ${i18n.__("command.serverinfo.responses.embed.owner")}:** ${owner}\n`,
		`**<:blobboost:796574763363205171> ${i18n.__("command.serverinfo.responses.embed.premiumTier.title")}**: ${message.guild.premiumTier ? `${i18n.__("command.serverinfo.responses.embed.premiumTier.level")} ${message.guild.premiumTier}` : `${i18n.__("command.serverinfo.responses.embed.premiumTier.none")}`}`,
		`**▹ <:boost_icon:796574762561568768> ${i18n.__("command.serverinfo.responses.embed.premiumSubscriptionCount")}:** ${message.guild.premiumTier ? `**${message.guild.premiumSubscriptionCount}**` : `**0**`} \n`,
		`**<:book_check:794649041984159826> ${i18n.__("command.serverinfo.responses.embed.moderation")}:**`,
		`**▹ ${i18n.__("command.serverinfo.responses.embed.verificationLevel")}:** ${verificationLevels[message.guild.verificationLevel]}`,
		`**▹ ${i18n.__("command.serverinfo.responses.embed.filterLevel")}:** ${filterLevels[message.guild.explicitContentFilter]}\n`,
		`**:calendar: ${i18n.__("command.serverinfo.responses.embed.createdAt.title")}:** ${moment(message.guild.createdTimestamp).format('LL')} ${i18n.__("command.serverinfo.responses.embed.createdAt.at")} ${moment(message.guild.createdTimestamp).format('LT')}\n`,
		`**<:graphics:794707740912123944> ${i18n.__("command.serverinfo.responses.embed.stats.title")}:**`,
		`**▹ ${i18n.__("command.serverinfo.responses.embed.stats.roles")}:** ${roles.length}`,
		`**▹ ${i18n.__("command.serverinfo.responses.embed.stats.emojis")}:** ${emojis.size}`,
		`**▹ ${i18n.__("command.serverinfo.responses.embed.stats.members")}:** ${message.guild.memberCount}`,
		`**▹ ${i18n.__("command.serverinfo.responses.embed.stats.channels")}** ${channels.size}\n`,
		'\u200b'
	])
	.setTimestamp();

	message.channel.send(message.author, ServerInfo);
};

exports.config = {
    name: 'serverinfo',
    enabled: true,
	guildOnly: true,
	aliases: [],
	permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'serverinfo',
	category: 'Diversos',
	description: 'Mostra as informações do servidor.',
	usage: 'serverinfo'
};