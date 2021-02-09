exports.run = async (Discord, client, message, args) => {
    let config = client.settings.get(message.guild.id).custom_configs;
    let select = message.guild.channels.cache;

    if(config) {
        let prefix = config.prefix;
        let lang = config.lang.replace('pt-br', 'Português').replace('en', 'English');
        let radio_channel = config.radio_channelID;
        let report_channel = config.report_channelID;
        let welcome_channel = config.welcome_channelID;
        let welcome_message = config.welcome_message;
        let welcome_role = config.welcome_roleID;
        let news_channel = config.news_channelID;

        if(radio_channel && select.get(radio_channel)) {
            radio_channel = select.get(radio_channel).name;
        };

        if(report_channel && select.get(report_channel)) {
            report_channel = select.get(report_channel);
        };

        if(welcome_channel && select.get(welcome_channel)) {
            welcome_channel = select.get(welcome_channel);
        };

        if(welcome_message) {
            welcome_message = welcome_message
            .replace('{{membro}}', message.member).replace('{{membro}}', message.member).replace('{{membro}}', message.member)
            .replace('{{servidor}}', message.guild.name).replace('{{servidor}}', message.guild.name)
            .replace('{{memberCount}}', message.guild.memberCount).replace('{{memberCount}}', message.guild.memberCount).replace('{{memberCount}}', message.guild.memberCount)
        };

        if(welcome_role && message.guild.roles.cache.get(welcome_role)) {
            welcome_role = message.guild.roles.cache.get(welcome_role);
        };

        if(news_channel && select.get(news_channel)) {
            news_channel = select.get(news_channel);
        };



        let Embed = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setThumbnail('https://image.prntscr.com/image/cET0U1G2ToWVKX_GkvU7jA.png')
        .addField('Configurações do Servidor', [
        `**Prefixo**:\n ${prefix}\n`,
        `**Língua**:\n ${lang}\n`,
        `**Canal de música**:\n ${radio_channel}\n`,
        `**Canal de boas vindas**:\n ${welcome_channel}\n`,
        `**Mensagem de boas vindas**:\n ${welcome_message}\n`,
        `**Cargo recebido ao entrar**:\n ${welcome_role}\n`,
        `**Canal de anúncios**:\n ${news_channel}\n`,
        `*Você pode alterar estas configurações através do [Meu Site](${client.config.website.link})*.`
        ])
        .setTimestamp();
        message.channel.send(message.author, Embed);
    }
};

exports.config = {
    name: 'serverconfig',
	enabled: true,
    guildOnly: true,
    aliases: ['sc'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'serverconfig',
	category: 'Moderação',
	description: 'Mostra as configurações do seu servidor',
	usage: 'serverconfig'
};