exports.run = async (Discord, client, message, args) => {
  let u = message.mentions.members.first() || client.users.cache.get(args[0]);

  if(u) {
    client.dbl.hasVoted(u.id).then(voted => {
      if(voted) {
        const Embed = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`${u.user.username} já votou em mim nas últimas **12 horas**! Muito obrigado!`)
        message.channel.send(message.author, Embed);
      } else {
        const Embed = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`${u.user} ainda não votou em mim nas últimas **12 horas** <:topgg:796784876610256928>. Vote [Aqui](https://top.gg/bot/${client.user.id}/vote?ref=botCommand)`)
        message.channel.send(message.author, Embed);
      }
    });
  } else if(message.author) {
    client.dbl.hasVoted(message.author.id).then(voted => {
      if(voted) {
        const Embed = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`Você já votou em mim nas últimas **12 horas**! Muito obrigado!`)
        message.channel.send(message.author, Embed);
      } else {
        const Embed = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`Você ainda não votou em mim nas últimas **12 horas** <:topgg:796784876610256928>. Vote [Aqui](https://top.gg/bot/${client.user.id}/vote?ref=botCommand)`)
        message.channel.send(message.author, Embed);
      }
    });
  }
};

exports.config = {
  name: 'vote',
	enabled: true,
  guildOnly: false,
  aliases: [],
  permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'vote',
	category: 'Bot',
	description: 'Checa se você ou outra pessoa já votou no bot no site *Top.gg*',
	usage: 'vote'
};
