exports.run = async (Discord, client, message, args, i18n) => {
	if(message.author.id === client.config.ownerID) {
		var time = Date.now();
	const code = args.join(' ');
	if (!code) {
		return message.reply('Cadê o código?');
	}
	try {
		const evaled = eval(code);
		const clean = await client.clean(client, evaled);
		if (clean.length > 1800) {
			message.channel.send(`${clean}\n\nTime taken: ${Date.now() - time}ms`, { code: 'xl', split: true }).catch(console.error);
		} else {
			var evalEmbed = new Discord.MessageEmbed()
				.setColor(client.config.color)
				.setDescription(`\`\`\`xl\n${clean}\`\`\``)
				.setFooter(`Time taken: ${Date.now() - time}ms`);
			message.channel.send({ embed: evalEmbed }).catch(console.error);
		}
	} catch (err) {
		if (err.message.length < 150) {
			var errorClean = await client.clean(client, err.message);
			var errorEmbed = new Discord.MessageEmbed()
				.setTitle('ERROR (Check console for error stack)')
				.setColor('RED')
				.setAuthor(client.user.username)
				.setDescription(`\`\`\`xl\n${errorClean}\`\`\``)
				.setFooter(`Time taken: ${Date.now() - time}ms`);
			message.channel.send({ embed: errorEmbed }).catch(console.error);
		} else {
			message.channel.send(`\`ERROR (Check console for error stack)\` \`\`\`xl\n${await client.clean(client, err.message)}\n\nTime taken: ${Date.now() - time}ms\n\`\`\``, { split: true }).catch(console.error);
		}
		console.log(err);
	}
	}
};

exports.config = {
    name: 'eval',
    enabled: true,
    guildOnly: false,
    aliases: [],
    permissions: []
  };
  
  exports.help = {
      name: 'eval',
      category: 'Somente para desenvolvedores',
      description: 'Executa um código',
      usage: 'eval {código}'
  };