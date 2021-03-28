exports.run = async (Discord, client, message, args, i18n) => {
  let u = message.mentions.members.first() || client.users.cache.get(args[0]);

  if(u) {
    client.topgg.hasVoted(u.id).then(voted => {
      if(voted) {
        const Embed = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`${u.user.username} ${i18n.__("command.vote.responses.userVoted")}`)
        message.channel.send(message.author, Embed);
      } else {
        const Embed = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`${u.user} ${i18n.__mf("command.vote.responses.userDidNotVote", {botID: client.user.id})}`)
        message.channel.send(message.author, Embed);
      }
    });
  } else if(message.author) {
    client.topgg.hasVoted(message.author.id).then(voted => {
      if(voted) {
        const Embed = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(i18n.__mf("command.vote.responses.youVoted"))
        message.channel.send(message.author, Embed);
      } else {
        const Embed = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(i18n.__mf("command.vote.responses.youDidNotVote", {
          botID: client.user.id
        }))
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
	description: 'Checa se você ou outra pessoa já votou no bot no site Top.gg',
	usage: 'vote'
};
