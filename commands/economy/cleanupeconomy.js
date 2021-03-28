exports.run = async (Discord, client, message, args, i18n) => {

    if(message.member.hasPermission(['MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']) || message.member.hasPermission('ADMINISTRATOR') || message.author.id === client.config.ownerID || message.guild.owner.id === message.author.id) {
      const filtered = client.balance.filter( p => p.guild === message.guild.id );

      const rightNow = new Date();
      const toRemove = filtered.filter(data => {
        return !message.guild.members.cache.has(data.user) || rightNow - 7776000000 > data.lastSeen;
      });
  
      toRemove.forEach(data => {
        client.balance.delete(`${message.guild.id}-${data.user}`);
      });
  
      message.channel.send(client.embed(i18n.__mf("command.cleanupeconomy.responses.description", {
          removedLength: toRemove.size,
      })))
    } else {
      return message.channel.send(client.embed(i18n.__("command.cleanupeconomy.errors.noperm")));
    }

};

exports.config = {
    name: 'cleanupeconomy',
    enabled: true,
	  guildOnly: true,
    aliases: ['cleareconomy', 'cleareconomy'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'cleanupeconomy',
	category: 'Moderação',
	description: 'Limpa os membros inativos mais de 3 meses ou que não estão mais no servidor da lista de economia.',
	usage: 'cleanup'
};