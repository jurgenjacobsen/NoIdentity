const fetch = require('node-fetch');

exports.run = async (Discord, client, message, args, i18n) => {

    const NoText = client.embed(i18n.__("command.trumptweet.errors.notext"))

    const TextTooLong = client.embed(i18n.__("command.trumptweet.errors.textoolong"))

    const Err = client.embed(i18n.__("command.trumptweet.errors.err"))

    let text = args.join(" ") || undefined;
    if (!text) return message.channel.send(message.author, NoText)
    if(text.length > 57) return message.channel.send(message.author, TextTooLong);
    message.channel.startTyping();
    fetch(`https://nekobot.xyz/api/imagegen?type=trumptweet&text=${encodeURIComponent(text)}`)
        .then(res => res.json())
        .then(data => message.channel.send(message.author, new Discord.MessageAttachment(data.message)))
        .catch(err => {
            message.channel.stopTyping(true);
            return message.channel.send(message.author, Err)
        });
    message.channel.stopTyping(true);
};

exports.config = {
    name: 'trumptweet',
    enabled: true,
	guildOnly: false,
    aliases: ['trump'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'trumptweet',
	category: 'Diversão',
	description: 'Cria um tweet como se fosse o trump',
	usage: 'trumptweet {texto}'
};