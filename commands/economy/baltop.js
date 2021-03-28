exports.run = async (Discord, client, message, args, i18n) => {
    const filtered = client.balance.filter( p => p.guild === message.guild.id ).array();

    const sorted = filtered.sort((a, b) => b.money - a.money);

    const top10 = sorted.splice(0, 10);

    const embed = new Discord.MessageEmbed()
    .setTitle(i18n.__("command.baltop.responses.embed.title"))
    .setDescription(i18n.__("command.baltop.responses.embed.description"))
    .setColor(client.config.color);

    let position = [];

    for(const data of top10) {
      try {
        position.push('0a0');
        embed.addField(`#${postion.length}`, `${client.users.cache.get(data.user).tag} - **$${data.money}**`);
      } catch {
        embed.addField(`#${position.length}`, `<@${data.user}> - **$${data.money}**`);
      }
    }
    return message.channel.send(embed);
};

exports.config = {
    name: 'baltop',
    enabled: true,
	  guildOnly: true,
    aliases: ['bt'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'baltop',
	category: 'Economia',
	description: 'Mostra os membros do servidor que possuem mais dinheiro.',
	usage: 'baltop'
};