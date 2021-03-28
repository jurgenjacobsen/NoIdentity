exports.run = async (Discord, client, message, args, i18n) => {

  if(message.member.hasPermission(['MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']) || message.member.hasPermission('ADMINISTRATOR') || message.author.id === client.config.ownerID || message.guild.owner.id === message.author.id) {
    const filtered = client.points.filter( p => p.guild === message.guild.id );

    const rightNow = new Date();
    const toRemove = filtered.filter(data => {
      return !message.guild.members.cache.has(data.user) || rightNow - 7776000000 > data.lastSeen;
    });

    toRemove.forEach(data => {
      client.points.delete(`${message.guild.id}-${data.user}`);
    });

    message.channel.send(client.embed(i18n.__mf("command.cleanup.responses.description", {
        removedLength: toRemove.size,
    })))
  } else {
    return message.channel.send(client.embed(i18n.__("command.cleanup.errors.noperm")));
  }

};

exports.config = {
  name: 'cleanup',
  enabled: true,
	guildOnly: true,
  aliases: ['clearlevel'],
  permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'cleanup',
	category: 'Moderação',
	description: 'Limpa o nível e pontos de membros inativos por mais de 3 meses',
	usage: 'cleanup'
};