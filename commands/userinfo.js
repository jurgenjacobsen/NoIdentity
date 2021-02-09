exports.run = async (Discord, client, message, args) => {
	const moment = require('moment');
	moment.updateLocale('pt-BR');

	const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
	const userData = client.usersdata.get(member.id);
	const status = {
		online: `**<:online:792864058389823529> Online**`,
		idle: `**<:idle:792864178377195550> Ausente**`,
		dnd: `**<:dnd:792864233120464908> Não perturbe**`,
		offline: `**<:offline:792864272199581756> Offline**`,
	};

	let boosterSince;
	let bot;
	let memberIcon;

	if(client.config.ownerID === member.id) {
        memberIcon = '<:staff_icon:796577477945851936>'
	} else if(userData.isPremium) {
        memberIcon = '<:blurple_verify:785248179301384212>'
	} else if(userData.isGuildChecked) {
        memberIcon = '<:fire:794273334996762624>'
	} else {
	    memberIcon = ''
	};

	if(member.premiumSinceTimestamp == 0) {
		boosterSince = 'Não é um booster.'
	} else {
		boosterSince = moment(member.premiumSinceTimestamp).format('L');
	};
	
	if(member.user.bot) {
		bot = "<:emoji_28:794299470333608006> Bot";
	} else {
		bot = "<:user_man:796902108082208778> Usuário";
	};

	const Embed = new Discord.MessageEmbed()
	.setThumbnail('https://image.prntscr.com/image/cET0U1G2ToWVKX_GkvU7jA.png')
    .setColor(client.config.color)
    .addField(`${memberIcon} Tag`, `${member.user.tag}`)
    .addField("<:paper_icon:794273334615080982> ID", member.user.id, true)
    .addField("<:wumpus_star:794707740198043668> Apelido", `${member.nickname !== null ? `${member.nickname}` : "Nenhum"}`)
	.addField("<:cmd:792864023942004776> Tipo de conta", `${bot}`, true)
	.addField(":calendar: Criou sua conta:", moment(member.user.createdAt).format('L'))
    .addField("<:boost_icon:796574762561568768> Booster desde", `${boosterSince}`, true)
    .setFooter(`Informações sobre ${member.user.username}`)
    .setTimestamp();
    
    message.channel.send(message.author, Embed);
	
};

exports.config = {
    name: 'userinfo',
    enabled: true,
	guildOnly: true,
	aliases: ['u'],
	permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'userinfo',
	category: 'Diversos',
	description: 'Mostra as informações de um usuário.',
	usage: 'userinfo'
};