exports.run = async (Discord, client, message, args) => {

    const { version } = require('discord.js');
    const moment = require('moment');
    require('moment-duration-format');

    var time = Date.now();
	const duration = moment.duration(client.uptime).format(' D [dias], H [h], m [m], s [s]');

	const Embed = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setTitle('Stats')
		.addField(`Uso de Memória`, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
		.addField(`Tempo Ativo`, `${duration}`, true)
		.addField(`Usuários`, `${client.users.cache.size}`, true)
		.addField(`Servidores`, `${client.guilds.cache.size}`, true)
		.addField(`Canais`, `${client.channels.cache.size}`, true)
		.addField(`Discord.js`, `v${version}`, true)
		.addField(`Node`, `${process.version}`, true)
		.addField(`Versão`, `v${client.version}`, true)
		.addField('ㅤ', 'ㅤ', true)
		.setFooter(`Tempo tomado: ${Date.now() - time}ms`);
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