module.exports = async (client, member) => {

    if(member.id === client.user.id) return;

    client.settings.ensure(member.guild.id, client.config.default.guild_settings);

    let settings = client.settings.get(member.guild.id).custom_configs;

    // Aumenta o número de pessoas que saíram nas estatísticas
    client.stats.inc(member.guild.id, 'guildMemberRemove');

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

}