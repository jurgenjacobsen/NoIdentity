exports.run = async (Discord, client, message, args, i18n) => {
	const moment = require('moment');
	moment.updateLocale('pt-BR');

	try {
		
	const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member;
	const userData = client.usersdata.get(member.id);

	let boosterSince;
	let bot;
	let memberIcon;

	if(userData) {
		if(client.config.ownerID === member.id) {
			memberIcon = '<:staff_icon:796577477945851936>'
		} else if(userData.isPremium) {
			memberIcon = '<:blurple_verify:785248179301384212>'
		} else if(userData.isGuildChecked) {
			memberIcon = '<:fire:794273334996762624>'
		} else {
			memberIcon = ''
		};
	} else {memberIcon = ''}

	if(!member.premiumSinceTimestamp) {
		boosterSince = i18n.__("command.userinfo.responses.isntBooster")
	} else {
		boosterSince = moment(member.premiumSinceTimestamp).format('L');
	};
	
	if(member.user.bot) {
		bot = `<:emoji_28:794299470333608006> ${i18n.__("command.userinfo.responses.bot")}`;
	} else {
		bot = `<:user_man:796902108082208778> ${i18n.__("command.userinfo.responses.user")}`;
	};

	let badges;

	if(member.user.flags) {
		badges = await member.user.flags.toArray();
	}

	const roles = member.roles.cache
	.sort((a, b) => b.position - a.position)
	.map(role => role.toString())
	.slice(0, -1);

	const flags = {
		DISCORD_EMPLOYEE: '<:staff_icon:796577477945851936>',
		DISCORD_PARTNER: '<:partner:785248179082887218>',
		BUGHUNTER_LEVEL_1: '<:bughunter:812716687773401108>',
		BUGHUNTER_LEVEL_2: '<:bughunter:812716687773401108>',
		HYPESQUAD_EVENTS: 'HypeSquad Events',
		HOUSE_BRAVERY: '<:hypesquad_bravery:812716687384117260>',
		HOUSE_BRILLIANCE: '<:hypesquad_briliance:812716687505883185>',
		HOUSE_BALANCE: '<:hypesquad_balance:812716687542976523>',
		EARLY_SUPPORTER: '<:earlysupporter:812716687526330368>',
		TEAM_USER: '',
		SYSTEM: '',
		VERIFIED_BOT: '<:emoji_28:794299470333608006>',
		VERIFIED_DEVELOPER: '<:bot_dev:812716687585050624>'
	};

	let badg;

	if(badges.length) {
		badg = `${badges ? badges.map(flag => flags[flag]).join(' ') : `${i18n.__("command.userinfo.responses.none")}`}`;
	} else {
		badg = `${i18n.__("command.userinfo.responses.none")}`;
	};

	let roles_list;
	//${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? roles.join(', ') : 'Nenhum'}
	if(roles.length <= 10) {
		roles_list = roles.join(', ');
	} else if(roles.length > 10) {
		roles.length = 10;
		roles_list = roles.join(', ') + `...`;
	} else {
		roles_list = `ㅤ`;
	}

	const Embed = new Discord.MessageEmbed();

	Embed
	.setThumbnail(member.user.displayAvatarURL({dynamic: true}).replace('webp', 'jpg') + '?size=1024')
    .setColor(client.config.color)
	.addField("ㅤㅤㅤㅤㅤㅤ", `ㅤㅤㅤㅤㅤ`, true)
	.addField(`ㅤㅤ**${i18n.__("command.userinfo.responses.user")}**`, `ㅤㅤㅤㅤㅤ`, true)
	.addField("ㅤㅤㅤㅤㅤㅤ", `ㅤㅤㅤㅤㅤ`, true)
    .addField(`${memberIcon} ${i18n.__("command.userinfo.responses.tag")}`, `${member.user.tag}`, true)
	.addField("ㅤㅤㅤㅤㅤㅤ", `ㅤㅤㅤㅤㅤ`, true)
    .addField(`<:paper_icon:794273334615080982> ${i18n.__("command.userinfo.responses.ID")}`, member.user.id, true)
    .addField(`<:wumpus_star:794707740198043668> ${i18n.__("command.userinfo.responses.nickname")}`, `${member.nickname !== null ? `${member.nickname}` : `${i18n.__("command.userinfo.responses.none")}`}`, true)
	.addField("ㅤ", `ㅤ`, true)
	.addField(`<:cmd:792864023942004776> ${i18n.__("command.userinfo.responses.accountType")}`, `${bot}`, true)
	.addField(`:calendar: ${i18n.__("command.userinfo.responses.createdAt")}`, moment(member.user.createdAt).format('L'), true)
	.addField("ㅤ", `ㅤ`, true)
    .addField(`<:boost_icon:796574762561568768> ${i18n.__("command.userinfo.responses.boosterSince")}`, `${boosterSince}`, true)
	.addField("ㅤㅤㅤㅤㅤㅤ", `ㅤㅤㅤㅤㅤ`, true)
	.addField(`**ㅤ${i18n.__("command.userinfo.responses.member")}**`, `ㅤㅤㅤㅤㅤ`, true)
	.addField("ㅤㅤㅤㅤㅤㅤ", `ㅤㅤㅤㅤㅤ`, true)
	.addField(`${i18n.__("command.userinfo.responses.joinedAt")}`, `${moment(member.joinedAt).format('L')}`, true)
	.addField(`${i18n.__("command.userinfo.responses.badges")}`, `${badg}`, true)
	.addField(`${i18n.__("command.userinfo.responses.roles")}`, `${roles_list}`, true)
	.addField("ㅤㅤㅤㅤㅤㅤ", `ㅤㅤㅤㅤㅤ`, true)
	.addField("ㅤㅤㅤㅤㅤㅤ", `ㅤㅤㅤㅤㅤ`, true)
	.addField("ㅤㅤㅤㅤㅤㅤ", `ㅤㅤㅤㅤㅤ`, true);
	if(member.user.presence.activities.length && message.member.user.presence.status !== 'offline') {
		let x = member.user.presence.activities.length - 1;
		let presenceAct = member.user.presence.activities[x];
		let stts;
		let st;
		let dt;
		if(presenceAct.type === 'PLAYING') {
			st = `${i18n.__("command.userinfo.responses.activity.playing")} <:controller:812700978100961310>`;
			stts = `${presenceAct.name}`;
		} else if(presenceAct.type === 'LISTENING') {
			st = `${i18n.__("command.userinfo.responses.activity.listening")} <:spotify:794266907939307572>`;
			stts = `${presenceAct.details}`;
		} else if(presenceAct.type === 'CUSTOM_STATUS') {
			st = `${i18n.__("command.userinfo.responses.activity.status")}`
			if(presenceAct.state) {
				stts = `${presenceAct.emoji ? presenceAct.emoji : ``} ${presenceAct.state}`
			} else if(presenceAct.emoji) {
				stts = `${presenceAct.emoji ? presenceAct.emoji : ``}`
			} else {
				stts = `${i18n.__("command.userinfo.responses.activity.error")}`;
			}
		} else stts = `${i18n.__("command.userinfo.responses.activity.error")}`;

		dt = presenceAct.details ? presenceAct.details : undefined;

		Embed
		.addField("ㅤㅤㅤㅤㅤㅤ", `ㅤㅤㅤㅤㅤ`, true)
		.addField(`** ${i18n.__("command.userinfo.responses.activity.title")}**`, `ㅤㅤㅤㅤㅤ`, true)
		.addField("ㅤㅤㅤㅤㅤㅤ", `ㅤㅤㅤㅤㅤ`, true)
		.addField(`${st ? st : `ㅤ`}`, `${stts}`, true)
		.addField("ㅤ", `ㅤ`, true)
		.addField(`${dt ? `${i18n.__("command.userinfo.responses.activity.details")}` : `ㅤ`}`, `${dt ? dt : `ㅤ`}`, true);
		if(presenceAct.url) {
			Embed
			.addField("ㅤ", `ㅤ`, true)
			.addField(`${i18n.__("command.userinfo.responses.activity.url")}`, `${presenceAct.url}`, true)
			.addField("ㅤ", `ㅤ`, true)
		}

	};
	Embed
    .setFooter(`${i18n.__mf("command.userinfo.responses.aboutWho", {member: member.user.username})}`)
    .setTimestamp();
    
    message.channel.send(message.author, Embed);
	
	} catch(err) {
		console.log(err);
		message.channel.send(client.embed(i18n.__("command.userinfo.errors.error")))
	}
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