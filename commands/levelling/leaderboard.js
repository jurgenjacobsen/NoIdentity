exports.run = async (Discord, client, message, args, i18n) => {
    const filtered = client.points.filter( p => p.guild === message.guild.id ).array();

    const sorted = filtered.sort((a, b) => b.points - a.points);

    const top10 = sorted.splice(0, 10);

    const embed = new Discord.MessageEmbed()
    .setTitle(i18n.__("command.leaderboard.responses.embed.title"))
    .setDescription(i18n.__("command.leaderboard.responses.embed.description"))
    .setColor(client.config.color);

    let position = [];

    for(const data of top10) {
      try {
        position.push('0a0');
        embed.addField(`#${postion.length}`, `${client.users.cache.get(data.user).tag} - ${data.points} ${i18n.__("command.leaderboard.responses.embed.points")} (${i18n.__("command.leaderboard.responses.embed.level")} ${data.level})`);
      } catch {
        embed.addField(`#${position.length}`, `<@${data.user}> - ${data.points} ${i18n.__("command.leaderboard.responses.embed.points")} (${i18n.__("command.leaderboard.responses.embed.level")} ${data.level})`);
      }
    }
    return message.channel.send(embed);
};

exports.config = {
    name: 'leaderboard',
    enabled: true,
	guildOnly: true,
    aliases: ['lb'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'leaderboard',
	category: 'Níveis',
	description: 'Mostra os membros do servidor que possuem mais nível.',
	usage: 'leaderboard'
};