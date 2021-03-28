exports.run = async (Discord, client, message, args, i18n) => {
	if (!args[0]) return message.reply('Diga um diretório');
	if (!args[1]) return message.reply('Diga um comando');

	try {
		let command;
		if (client.commands.has(args[1])) {
			command = client.commands.get(args[1]);
		} else if (client.aliases.has(args[1])) {
			command = client.commands.get(client.aliases.get(args[1]));
		}
		if (!command) return;
		command = command.config.name;
	
		delete require.cache[require.resolve(`../${args[0]}/${command}.js`)];
		const cmd = require(`../${args[0]}/${command}.js`);
		client.commands.delete(command);
		client.aliases.forEach((cmd, alias) => {
			if (cmd === command) client.aliases.delete(alias);
		});
		client.commands.set(command, cmd);
		cmd.config.aliases.forEach(alias => {
			client.aliases.set(alias, cmd.config.name);
		});
	
		message.reply(`\`${command}\` recarregado!`);
	} catch (err) {

	}
};

exports.config = {
    name: 'reload',
    enabled: true,
	guildOnly: false,
    aliases: [],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'reload',
	category: 'Somente para desenvolvedores',
	description: 'Recarrega um comando',
	usage: 'reload'
};