const { get } = require("https");

exports.run = async (Discord, client, message, args, i18n) => {

    if(client.commands.has(args[0]) || client.aliases.has(args[0])) {
        let cmd;
        if (client.commands.has(args[0])) {
            cmd = client.commands.get(args[0]);
        } else if (client.aliases.has(args[0])) {
            cmd = client.commands.get(client.aliases.get(args[0]));
        }
    
        var cmdPath = `command.${cmd.config.name}.help`;
    
        const emb = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`
            ${i18n.__mf("command.help.responses.command.title", { commandName: cmd.config.name })} \n\n
            **${i18n.__("command.help.responses.command.cat")}**: ${i18n.__(`${cmdPath}.category`)}\n
            **${i18n.__("command.help.responses.command.description")}**: ${i18n.__(`${cmdPath}.description`)}\n
            **${i18n.__("command.help.responses.command.usage")}**: *${i18n.__(`${cmdPath}.example`)}*\n
            **${i18n.__("command.help.responses.command.aliases")}**: *${cmd.config.aliases.join(', ')}*
        `);
        message.channel.send(message.author, emb)
    } else {
        const Embed = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(i18n.__mf("command.help.responses.description", {
            prefix: client.settings.get(message.guild.id).custom_configs.prefix || client.config.prefix
        }));

        let lg;

        if(client.languages.includes(client.settings.get(message.guild.id).custom_configs.lang)) {
            lg = client.settings.get(message.guild.id).custom_configs.lang;
        } else {
            lg = 'pt_br';
        }

        const help = {};
        client.commands.forEach((command) => {
            const cat = command.help.category;
            if(!help.hasOwnProperty(cat)) help[cat] = [];
                help[cat].push(command);
        });
        for(const category in help) {
            if(category !== `Somente para desenvolvedores`) {
                let commandsArray = [];
                    for (const command of help[category]) {
                        commandsArray.push(`*${command.config.name}* - ${i18n.__(`command.${command.config.name}.help.description`)}`);
                    }
                Embed.addField(category.toUpperCase(), commandsArray);
            }
        };
        message.channel.send(message.author, Embed);

    }
};

exports.config = {
    name: 'help',
    enabled: true,
	guildOnly: false,
	aliases: ['ajuda'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'help',
	category: "Bot",
    description: "Mostra os comandos do bot",
    usage: "help"
};