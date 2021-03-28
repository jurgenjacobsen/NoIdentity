const Discord = require("discord.js");
const i18n = require("i18n");
const ms = require("parse-ms");

module.exports = async (client, message) => {

    // Se o usuário é um bot ele não vai responder
    if(message.author.bot) return;

    // Prefixo
    let prefix;

    // Checa se a mensagem foi executada em servidor
    if(message.guild) {

        // Aumenta o número de mensagens enviadas nas estatísticas
        client.stats.inc(message.guild.id, 'messages');

        // Verifica se as configurações do servidor são válidas
        client.settings.ensure(message.guild.id, client.config.default.guild_settings);
        client.settings.set(message.guild.id, message.guild.id, 'id');
        
        // Configurações do servidor
        let settings = client.settings.get(message.guild.id).custom_configs;
        
        // Setar um prefixo
        if(settings.prefix.length !== 0) {
            prefix = settings.prefix;
        } else {
            prefix = client.config.prefix;
        }

        // Seta a língua que o bot vai responder os comandos
        if(client.languages.includes(settings.lang)) {
            i18n.setLocale(settings.lang);
        } else {
            i18n.setLocale('pt_br');
        };

        // Função de sugestão
        if(message.channel.id === settings.suggestionChannelID) {
            
            if(message.guild.me.hasPermission('MANAGE_MESSAGES')) {
                message.delete();
            };

            if(message.content.length >= 5) {
                
                let Embed = new Discord.MessageEmbed()
                .setColor(client.config.color)
                .setDescription(`${i18n.__("modules.functions.suggestion.suggestion")}: ${message.content}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL());

                if(message.attachments.first()) {
                    Embed.setImage(message.attachments.first().url);
                }

                let upvoteEmojiID = message.guild.emojis.cache.get(settings.custom_upvotes_emojiID) ? settings.custom_upvotes_emojiID : "785248178752585750";
                let downvoteEmojiID = message.guild.emojis.cache.get(settings.custom_downvote_emojiID) ? settings.custom_downvote_emojiID : "785248178836340747";
                let approveEmojiID = message.guild.emojis.cache.get(settings.custom_approved_emojiID) ? settings.custom_approved_emojiID : "785248179301384212";

                message.channel.send(`ㅤ`, Embed).then(msg => {
                    msg.react(upvoteEmojiID)
                    .then(() => msg.react(downvoteEmojiID))
                    .then(() => msg.react(approveEmojiID))
                    .catch((err) => {
                        console.log(err.code)
                    });
                });

            };
            return;
        };
        
        // Função de afazeres
        if(message.channel.id === settings.toDoChannelID || message.channel.id === settings.secondToDoChannelID) {

            if(message.guild.me.hasPermission('MANAGE_MESSAGES')) {
                message.delete();
            };

            let Date = message.content.slice(0, 10);
            let dateFormat = /(\d{1,2})([/-])(\d{1,2})\2(\d{4})/;
            let engDateFormat = /(\d{4})([/-])(\d{1,2})\2(\d{1,2})/

            if(!dateFormat.test(Date) && !engDateFormat.test(Date)) {
                Date = null;
            };
            
            const Embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setAuthor(`${message.author.tag} ${message.guild.id === client.config.bot_guild.id ? `- ${message.member.roles.highest.name}` : ``}`, message.author.displayAvatarURL())
            .setFooter(`Status: ${i18n.__("modules.functions.toDo.statusPending")}`)
            .setDescription(`
                ${i18n.__("modules.functions.toDo.description")}: ${Date ? message.content.replace(Date, '').slice(1) : message.content} \n
                ${Date ? `${i18n.__("modules.functions.toDo.limitDate")}: ${Date}` : ''} \n
            `);

            if(message.attachments.first()) {
                Embed.setImage(message.attachments.first().url);
            };

            message.channel.send(Embed).then(embedSent => {
                embedSent.react('813506789323964476').then(() => {
                    embedSent.react('813506789064048701');
                });
            });
            return;
        };

        // Função de levels
        if(settings.levels === true && !settings.level_blacklistedChannels.includes(message.channel.id)) {

            const key = `${message.guild.id}-${message.author.id}`;

            client.points.ensure(key, {
                user: message.author.id,
                guild: message.guild.id,
                points: 0,
                level: 1,
                cooldown: null,
            });

            let timeout = 120000;

            let delay = client.points.get(key).cooldown;
        
            if(delay !== null && timeout - (Date.now() - delay) > 0) {

            } else {
    
                client.points.inc(key, "points");
    
                let factor = .25;
    
                const currentLevel = Math.floor(factor * Math.sqrt(client.points.get(key, "points")));
    
                if(client.points.get(key, "level") < currentLevel) {
    
                    let notification = client.embed(i18n.__mf("events.message.levelup", {
                        curLevel: currentLevel
                    }));
    
                    client.points.set(key, currentLevel, "level");
    
                    let lvlUPChannel = settings.levelup_channelID;
    
                    if(message.guild.channels.cache.get(lvlUPChannel)) {
                        message.guild.channels.cache.get(levelUpChannel).send(message.author, notification);
                    } else {
                        message.channel.send(message.author, notification);
                    };
    
                }

                client.points.set(key, Date.now(), 'cooldown');

            }
        }

    } else {
        // Se a mensagem não foi enviada na DM o prefixo será o padrão
        prefix = client.config.prefix;
    }

    // Checa se a mensagem começa com o prefixo
    if(message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Procura pelo comando ou aliás
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    // Se não for comando encerra a função
    if(!cmd) return;

    // Blocked users
    //if(client.config.blockedlist.includes(message.author.id)) return message.reply('ERROR: 302 - Houve um erro ao processar este comando, tente novamente em 10 minutos!');

    // Checa as configurações da pessoa
    client.usersdata.ensure(message.author.id, client.config.default.user_settings);

    // Se o comando estiver ativado
    if(cmd.config.enabled === true) {

        // Função de checagem permissões
        const permissions = (perm) => {
            return new Discord.Permissions(perm);
        };

        try {
                // Se o canal de texto é um servidor
        if(message.channel.type === 'text') {
            // Aumenta o número de comandos enviados nas estatísticas
            client.stats.inc(message.guild.id, 'commands');

            let nescessaryPermissions = [];

                // Se o comando for o levelconfig vai rodá-lo
            if(cmd.config.name === 'levelconfig') {
                
                cmd.run(Discord, client, message, args, i18n);

            } else {
                // Checa se o comando for de nível e se estiver ativado no servidor, se não, não será executado.
                if(cmd.help.category !== 'Níveis' || cmd.help.category === 'Níveis' && client.settings.get(message.guild.id).custom_configs.levels === true) {

                    cmd.run(Discord, client, message, args, i18n);

                } else {
                    message.channel.send(client.embed(i18n.__("events.message.levelSystemOff")));
                }
            }

            client.log(`COMMAND`, `[${message.guild.id || `DM`}] ${message.author.tag} (${message.author.id}) - ${command} ${args.join(' ')}`);

            // Checa se o comando foi enviado em DM
            } else if(message.channel.type == `dm`) {
                // Checa se o comando foi configurado para ser executado somente em servidores
                if(!cmd.config.guildOnly) {
                    cmd.run(Discord, client, message, args, i18n);
                    client.log(`COMMAND`, `${message.author.tag} (${message.author.id}) - ${command} ${args.join(' ')}`);
                };
            }
        } catch(err) {
            console.log(err);
        }
    } else { 
        client.log(`COMMAND`, `${message.author.tag} (${message.author.id}) - ${prefix}${command} ${args.join(' ')}`);
    }
}