exports.run = async (Discord, client, message, args, i18n) => {

    const { version } = require('discord.js');
    const moment = require('moment');
    require('moment-duration-format');

    var time = Date.now();
	const duration = moment.duration(client.uptime).format(` D [${i18n.__("command.stats.responses.time.days")}], H [${i18n.__("command.stats.responses.time.hours")}], m [${i18n.__("command.stats.responses.time.minutes")}], s [${i18n.__("command.stats.responses.time.seconds")}]`);

	const Embed = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setTitle(i18n.__("command.stats.responses.embed.title"))
		.addField(`${i18n.__("command.stats.responses.embed.memory")}`, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
		.addField(`${i18n.__("command.stats.responses.embed.uptime")}`, `${duration}`, true)
		.addField(`${i18n.__("command.stats.responses.embed.users")}`, `${client.totalUsers}`, true)
		.addField(`${i18n.__("command.stats.responses.embed.servers")}`, `${client.guilds.cache.size}`, true)
		.addField(`${i18n.__("command.stats.responses.embed.channels")}`, `${client.channels.cache.size}`, true)
		.addField(`Discord.js`, `v${version}`, true)
		.addField(`Node`, `${process.version}`, true)
		.addField(`${i18n.__("command.stats.responses.embed.version")}`, `v${client.version}`, true)
		.addField('ㅤ', 'ㅤ', true)
		.setFooter(`${i18n.__("command.stats.responses.embed.time_taken")}: ${Date.now() - time}ms`);
        message.channel.send(message.author, Embed);   
};

exports.config = {
    name: 'stats',
	enabled: true,
	guildOnly: false,
	aliases: [],
	permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'stats',
	category: 'Bot',
	description: 'Mostra as estatísticas do bot',
	usage: 'stats'
};