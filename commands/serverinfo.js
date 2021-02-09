exports.run = async (Discord, client, message, args) => {
	const g = message.guild;
	const moment = require('moment');

	moment.locale('pt-br');
	const regions = {
		'brazil': 'Brasil :flag_br:',
		'europe': 'Europa :flag_eu:',
		'hongkong': 'Hong Kong :flag_hk:',
		'india': 'India :flag_in:',
		'japan': 'Japão :flag_jp:',
		'russia': 'Rússia :flag_ru:',
		'singapore': 'Singapura :flag_sg:',
		'southafrica': 'África do Sul :flag_za:',
		'sydeny': 'Sidney :flag_au:',
		'us-central': 'USA Central :flag_us:',
		'us-east': 'USA Leste :flag_us:',
		'us-west': 'US Oeste :flag_us:',
		'us-south': 'US Sul :flag_us:'
	};

	const filterLevels = {
		DISABLED: 'Desligado',
		MEMBERS_WITHOUT_ROLES: 'Somente para pessoas sem cargo',
		ALL_MEMBERS: 'Se aplica a todos'
	};
	
	const verificationLevels = {
		NONE: 'Nenhum',
		LOW: 'Baixo',
		MEDIUM: 'Médio',
		HIGH: 'Alto',
		VERY_HIGH: 'Muito Alto'
	};

	const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
	const members = message.guild.members.cache;
	const channels = message.guild.channels.cache;
	const emojis = message.guild.emojis.cache;

	const ServerInfo = new Discord.MessageEmbed()
	.setTitle(g.name)
	.setThumbnail(message.guild.iconURL({ dynamic: true }))
	.setColor(client.config.color)
	.addField('Informações', [
		`**<:paper_icon:794273334615080982> Nome:** ${message.guild.name}`,
		`**▹ ID:** ${message.guild.id}`,
		`**▹ Região:** ${regions[message.guild.region]}\n`,
		`**<:staff_icon:796577477945851936> Dono(a):** ${message.guild.owner.user}\n`,
		`**<:blobboost:796574763363205171> Nível de Boost:** ${message.guild.premiumTier ? `Nível ${message.guild.premiumTier}` : 'Nenhum'}`,
		`**▹ <:boost_icon:796574762561568768> Quantia de boosts:** ${message.guild.premiumSubscriptionCount || '0'}\n`,
		`**<:book_check:794649041984159826> Moderação:**`,
		`**▹ Nível de verificação:** ${verificationLevels[message.guild.verificationLevel]}`,
		`**▹ Filtro de mídia:** ${filterLevels[message.guild.explicitContentFilter]}\n`,
		`**:calendar: Data de crianção:** ${moment(message.guild.createdTimestamp).format('LL')} às ${moment(message.guild.createdTimestamp).format('LT')}\n`,
		`**<:graphics:794707740912123944> Estatisticas:**`,
		`**▹ Cargos:** ${roles.length}`,
		`**▹ Emojis:** ${emojis.size}`,
		`**▹ Membros:** ${message.guild.memberCount}`,
		`**▹ Canais** ${channels.size}\n`,
		`**<:cmd:792864023942004776> Atividade:**`,
		`**<:online:792864058389823529> Online:** ${members.filter(member => member.presence.status === 'online').size}`,
		`**<:idle:792864178377195550> Ausente:** ${members.filter(member => member.presence.status === 'idle').size}`,
		`**<:dnd:792864233120464908> Não perturbe:** ${members.filter(member => member.presence.status === 'dnd').size}`,
		`**<:offline:792864272199581756> Offline:** ${members.filter(member => member.presence.status === 'offline').size}`,
		'\u200b'
	])
	.setTimestamp();
	

	message.channel.send(messages.author, ServerInfo);
};

exports.config = {
    name: 'serverinfo',
    enabled: true,
	guildOnly: true,
	aliases: [''],
	permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'serverinfo',
	category: 'Diversos',
	description: 'Mostra as informações do servidor.',
	usage: 'serverinfo'
};