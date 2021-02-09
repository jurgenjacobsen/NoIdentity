const Discord = require('discord.js');

module.exports = async (client, member) => {

    if(member.id === client.user.id) return;

    let guild = member.guild;
    let config = client.settings.get(guild.id).custom_configs;
    let profile = client.settings.get(guild.id).profile;

    if(config) {
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
    }
};