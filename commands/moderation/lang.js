const { MessageEmbed } = require("discord.js");

exports.run = async (Discord, client, message, args, i18n) => {
    try {

        if(message.member.hasPermission(['MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']) || message.member.hasPermission(['ADMINISTRATOR']) || message.author.id === client.config.ownerID || message.author.id === message.guild.owner.id) {
            const Embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setDescription(i18n.__mf("command.lang.responses.description", {
                actual_lang: client.settings.get(message.guild.id).custom_configs.lang.replace('pt_br', 'Português').replace('en', 'English').replace('es', 'Espanõl')
            }));
            for(let lang of client.languages) {
                let langFile = require(`../../languages/${lang}`);
                let lDescription = langFile.command.lang.responses.langDescription;
                let lName = lang
                .replace('en', ':flag_us: English')
                .replace('es', ':flag_es: Espanõl')
                .replace('pt_br', ':flag_br: Português')
                .replace('de', ':flag_de: Deutsche')
                .replace('jp', ':flag_jp: 日本語')
        
                Embed.addField(lName, lDescription)
            }
            
            let Sent = await message.channel.send(Embed)
            Sent.react('🇺🇸').then(() => 
                Sent.react('🇪🇸')).then(() => 
                    Sent.react('🇧🇷'))
        
            const filter = (reaction, user) => {
                return user.id === message.author.id;
            };
        
            const collector = Sent.createReactionCollector(filter, {time: 60000, errors: ['time']});
        
            collector.on('collect', async (reaction, user) => {
                if(reaction.emoji.name === '🇺🇸') {
                    await langChange(user, 'en');
                } else if(reaction.emoji.name === '🇪🇸') {
                    await langChange(user, 'es');
                } else if(reaction.emoji.name === '🇧🇷') {
                    await langChange(user, 'pt_br');
                } else if(reaction.emoji.name === '🇩🇪') {
                    await langChange(user, 'de');
                } else if(reaction.emoji.name === '🇯🇵') {
                    await langChange(user, 'jp');
                }
            });
        
            collector.on('end', collected => {
                const e = client.embed(i18n.__("command.lang.errors.timeout"));
                Sent.edit(e);
                Sent.reactions.removeAll();
                Sent.delete({timeout: 15000});
                message.delete({timeout: 15000});
            });
        
            async function langChange(user, lang) {
                await client.settings.set(message.guild.id, lang, 'custom_configs.lang');
        
                let lName = lang
                .replace('en', ':flag_us: English')
                .replace('es', ':flag_es: Espanõl')
                .replace('pt_br', ':flag_br: Português')
                .replace('de', ':flag_de: Deutsche')
                .replace('jp', ':flag_jp: 日本語')
        
                i18n.setLocale(lang);
                const e = client.embed(i18n.__mf("command.lang.responses.changed", {
                    lang: lName
                }));
        
                Sent.edit(user, e);
                Sent.reactions.removeAll();
        
                client.log('LANG', `[${message.guild.id}] ${message.author.tag} (${message.author.id}) Alterou a língua para ${lang}`);
            }
        } else {
            message.channel.send(message.author, client.embed(i18n.__("command.cleanup.errors.noperm")))
        }
    } catch(err) {
        console.log(err.code);
    }
};

exports.config = {
    name: 'lang',
    enabled: true,
	guildOnly: true,
	aliases: ['language', 'lingua'],
    permissions: ['SEND_MESSAGES', 'ADD_REACTIONS']
};

exports.help = {
	name: 'lang',
	category: "Moderação",
    description: "Altera a língua na qual eu responderei meus comandos.",
    usage: "lang"
};