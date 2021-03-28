const fetch = require('node-fetch');

exports.run = async (Discord, client, message, args, i18n) => {

    const Err = client.embed(i18n.__("command.blurpify.errors.error"))

    let user;
    if(!message.mentions.users.first()) {
        user = client.users.cache.get(args[0]) || message.author;
    } else {
        user = message.guild.member(message.mentions.users.first()).user;
    }

    message.channel.startTyping();
    fetch(`https://nekobot.xyz/api/imagegen?type=blurpify&image=${user.displayAvatarURL().replace('webp', 'png')}?size=512`)
        .then(res => res.json())
        .then(data => message.channel.send(message.author, new Discord.MessageAttachment(data.message)))
        .catch(err => {
            message.channel.stopTyping(true);
            return message.channel.send(message.author, Err)
        });
    message.channel.stopTyping(true);
};

exports.config = {
    name: 'blurpify',
    enabled: true,
	guildOnly: true,
    aliases: [],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'blurpify',
	category: "Diversão",
    description: "Blurpifica o seu avatar ou de alguém",
    usage: "blurpify @pessoa"
};