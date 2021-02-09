const Discord = require("discord.js");

module.exports = async (client, message) => {
    if(message.author.bot) return;

    await client.suggestion('MESSAGE', message);

    let prefix;

    if(message.guild) {
        if(client.settings.get(message.guild.id).custom_configs.prefix) {
            prefix = client.settings.get(message.guild.id).custom_configs.prefix;
        } else {
            prefix = client.config.prefix;
        };
    } else {
        prefix = client.config.prefix
    };

    if(message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    client.emit('music', message, command, args)

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    if(!cmd) return;

    const { Permissions } = require('discord.js');
    const permissions = (perm) => {
        return new Permissions(perm);
    };

    if(cmd.config.enabled == true) {
        if(message.channel.type == `text`) {
            let permResult = [];
            if(cmd.config.permissions.length !== 0) {
                cmd.config.permissions.map(perm => {
                    if(!permissions(message.guild.me.permissions.bitfield).has(perm)) {
                        permResult.push(perm);
                    };
                });
            };

            if(permResult.length == 0) {
                cmd.run(Discord, client, message, args);
                client.log(`COMMAND`, `[${message.guild.id || `DM`}] ${message.author.tag} (${message.author.id}) - ${command} ${args.join(' ')}`);

                client.statsFunction('POST', 'COMMAND');
                if(cmd.help.category === 'Música') {
                    client.statsFunction('POST', 'COMMAND', 'MUSIC');
                };
            } else {
                client.log(`COMMAND`, `[${message.guild.id || `DM`}] ${message.author.tag} (${message.author.id}) - ${command} ${args.join(' ')}`);
                message.reply(`Não foi possível executar este comando pois não possuo estas permissões: \`${permResult.join(', ')}\``)
            }
        } else if(message.channel.type == `dm`) {
            if(!cmd.config.guildOnly) {
                cmd.run(Discord, client, message, args);
                client.log(`COMMAND`, `${message.author.tag} (${message.author.id}) - ${command} ${args.join(' ')}`);

                client.statsFunction('POST', 'COMMAND');
                if(cmd.help.category === 'Música') {
                    client.statsFunction('POST', 'COMMAND', 'MUSIC');
                };
                
            } else {
                client.log(`COMMAND_ERROR`, `${message.author.tag} (${message.author.id}) - ${command} ${args.join(' ')}`);
            }
        } else {
            client.log(`COMMAND_ERROR`, `${message.author.tag} (${message.author.id}) - ${command} ${args.join(' ')}`);
        };
    } else {
        client.log(`COMMAND`, `${message.author.tag} (${message.author.id}) - ${command} ${args.join(' ')}`);
    }
};