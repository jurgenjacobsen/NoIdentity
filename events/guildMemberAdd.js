const Discord = require('discord.js');

module.exports = async (client, member) => {

    if(member.id === client.user.id) return;

    let guild = member.guild;
    let profile = client.settings.get(guild.id).profile;

    if(guild.id === '782722663549763585') {
        client.usersdata.ensure(member.id, client.config.default.user_settings);
        client.usersdata.set(member.id, true, 'isGuildChecked');
    }

    // Aumenta o número de pessoas que entraram nas estatísticas
    client.stats.inc(guild.id, 'guildMemberAdd');


    client.settings.ensure(member.guild.id, client.config.default.guild_settings);

    let settings = client.settings.get(member.guild.id).custom_configs;
    let config = client.settings.get(member.guild.id).custom_configs;

    if(config) {

        if(settings.memberCountChannel) {
            if(member.guild.channels.cache.get(settings.memberCountChannel)) {

                const num_conv = require('number-to-words');

                let channel = member.guild.channels.cache.get(settings.memberCountChannel);

                let membersCount = member.guild.memberCount.toLocaleString().split('');

                let numbersArray = [];

                var a = member.guild.memberCount.toLocaleString().split('');
            
                for(const number of membersCount) {
                    numbersArray.push(`:${num_conv.toWords(number)}:`)
                };

                let topicText = settings.memberCounterText ? settings.memberCounterText : '{{counter}}';
                    topicText = topicText.replace('{{counter}}', numbersArray.join(''));
                
                channel.setTopic(topicText);

            }
        }

        if(config.welcome_channelID && config.welcome_message) {
            if(guild.channels.cache.get(config.welcome_channelID)) {
                let message = config.welcome_message
                .replace('{{membro}}', member).replace('{{membro}}', member).replace('{{membro}}', member)
                .replace('{{servidor}}', guild.name).replace('{{servidor}}', guild.name).replace('{{servidor}}', guild.name)
                .replace('{{memberCount}}', guild.memberCount).replace('{{memberCount}}', guild.memberCount).replace('{{memberCount}}', guild.memberCount);

                let color = profile.theme_color || client.config.color;
                let channel = guild.channels.cache.get(config.welcome_channelID);

                let Embed = new Discord.MessageEmbed()
                .setColor(color)
                .setAuthor(member.user.tag, member.user.displayAvatarURL())
                .setDescription(message);

                channel.send(member, Embed);
            }
        }
        if(config.welcome_roleID) {
            if(member.guild.roles.cache.get(config.welcome_roleID)) {
                let role = member.guild.roles.cache.get(config.welcome_roleID);

                member.roles.add(role).catch(console.error);
            }
        }
    }
};