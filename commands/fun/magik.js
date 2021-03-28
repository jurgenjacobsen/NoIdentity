const fetch = require('node-fetch');

exports.run = async (Discord, client, message, args, i18n) => {

    const Err = client.embed(i18n.__("command.blurpify.errors.error"))

    let user;
    if(!message.mentions.users.first()) {
        user = client.users.cache.get(args[0]) || message.author;
    } else {
        user = message.guild.member(message.mentions.users.first()).user;
    }

    let url;
    if(message.attachments.first()) {
        url = message.attachments.first().url;
    } else {
        url = user.displayAvatarURL().replace('webp', 'png');
    }

    message.channel.startTyping();
    fetch(`https://nekobot.xyz/api/imagegen?type=magik&image=${url}?size=512`)
        .then(res => res.json())
        .then(data => message.channel.send(message.author, new Discord.MessageAttachment(data.message)))
        .catch(err => {
            message.channel.stopTyping(true);
            return message.channel.send(message.author, Err)
        });
    message.channel.stopTyping(true);
};

exports.config = {
    name: 'magik',
    enabled: true,
	guildOnly: true,
    aliases: [],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'magik',
	category: "Diversão",
    description: "Faz um photoshop magik em alguém",
    usage: "magik @pessoa"
};