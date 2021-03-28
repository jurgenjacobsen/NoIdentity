const fetch = require('node-fetch');

exports.run = async (Discord, client, message, args, i18n) => {
    const NoText = client.embed(i18n.__("command.ascii.errors.notext"))

    const TextTooLong = client.embed(i18n.__("command.ascii.errors.toolongtext"))

	let text = encodeURIComponent(args.join(' '));
    if(!text) return message.channel.send(message.author, NoText);

    message.channel.startTyping();
    fetch(`http://artii.herokuapp.com/make?text=${text}`)
    .then(res => res.text())
    .then(body => {
        if (body.length > 2000 || text.length > 16) return message.channel.send(message.author, TextTooLong);
        return message.reply(body, {
            code: "fix"
        });
    })
    .catch(error => {
        const Err = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(i18n.__("command.ascii.errors.error"));
        return message.channel.send(message.author, Err);
    });
    
    message.channel.stopTyping(true);
};

exports.config = {
    name: 'ascii',
    enabled: true,
	guildOnly: false,
    aliases: [],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'ascii',
	category: "Diversão",
    description: "Transforma um texto em ASCII",
    usage: "ascii {texto}"
};