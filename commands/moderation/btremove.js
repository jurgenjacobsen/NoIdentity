exports.run = async (Discord, client, message, args, i18n) => {

	if(message.member.hasPermission(['MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS']) || message.member.hasPermission(['ADMINISTRATOR']) || message.author.id === client.config.ownerID || message.author.id === message.guild.owner.id) {

		let userToDelete = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if(userToDelete) {

			try {
				let msg = await message.channel.send(client.embed(i18n.__mf("command.btremove.really", {userToDeleteId: userToDelete.id})));
				msg.react('785248178752585750').then(() => msg.react('785248178836340747'));

				const filter = (reaction, user) => {
					return user.id === message.author.id;
				};

				const collector = msg.createReactionCollector(filter, {time: 60000, errors: ['time']});

				collector.on('collect', async (reaction, user) => {
					if(reaction.emoji.id === '785248178752585750') {

						await msg.reactions.removeAll();
						await client.balance.delete(`${message.guild.id}-${userToDelete.id}`);
						msg.edit(client.embed(i18n.__mf("command.btremove.cleaned", {userToDeleteId: userToDelete.id})));
						collector.stop();

					} else if(reaction.emoji.id === '785248178836340747') {

						await msg.reactions.removeAll();
						msg.edit(client.embed(i18n.__("command.btremove.cancel")));
						collector.stop();

					} else {
						reaction.users.remove(user).catch(console.error);
					}
				});

				collector.on('end', () => {
					msg.reactions.removeAll();
				});
			} catch(err) {
				message.channel.send(message.author, client.embed(i18n.__("command.btremove.err")));
			}
		} else {
			message.channel.send(message.author, client.embed(i18n.__("command.btremove.nouser")));
		}
		
	} else {
		message.channel.send(message.author, client.embed(i18n.__("command.btremove.noperms")));
	}


};

exports.config = {
    name: 'btremove',
    enabled: true,
	guildOnly: true,
	aliases: ['btr'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'btremove',
	category: 'Moderação',
	description: 'Remove alguém do baltop',
	usage: 'btr <id ou @>'
};