exports.run = async (Discord, client, message, args, i18n) => {

	if(message.member.hasPermission(['MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']) || message.member.hasPermission(['ADMINISTRATOR']) || message.author.id === client.config.ownerID || message.author.id === message.guild.owner.id) {

		let userToDelete = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if(userToDelete) {

			try {
				let msg = await message.channel.send(client.embed(`Você tem certeza que deseja resetar o nível e XP de <@!${userToDelete.id}> neste servidor ?`));
				msg.react('785248178752585750').then(() => msg.react('785248178836340747'));

				const filter = (reaction, user) => {
					return user.id === message.author.id;
				};

				const collector = msg.createReactionCollector(filter, {time: 60000, errors: ['time']});

				collector.on('collect', async (reaction, user) => {
					if(reaction.emoji.id === '785248178752585750') {

						await msg.reactions.removeAll();
						await client.points.delete(`${message.guild.id}-${userToDelete.id}`);
						msg.edit(client.embed(`Você limpou as informações de <@!${userToDelete.id}>!`));
						collector.stop();

					} else if(reaction.emoji.id === '785248178836340747') {

						await msg.reactions.removeAll();
						msg.edit(client.embed(`Você cancelou a limpeza de dados deste usuário!`));
						collector.stop();

					} else {
						reaction.users.remove(user).catch(console.error);
					};
				});

				collector.on('end', () => {
					msg.reactions.removeAll();
				});
			} catch(err) {
				message.channel.send(message.author, client.embed(`Houve um erro ao executar esta ação, talvez este usuário já não possue nenhum nível ou XP!`));
			}
		} else {
			message.channel.send(message.author, client.embed('Você deve mencionar ou indicar um ID de usuário para eu resetar!'))
		}
		
	} else {
		message.channel.send(message.author, client.embed(`Você não possue permissões para isso!`))
	}


};

exports.config = {
    name: 'lbremove',
    enabled: true,
	guildOnly: true,
	aliases: ['lbr'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'lbremove',
	category: 'Moderação',
	description: 'Remove o nível e XP de alguém',
	usage: 'lbr <id ou @>'
};