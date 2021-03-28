const fetch = require('node-fetch');

exports.run = async (Discord, client, message, args, i18n) => {

    const NotTwoMembers = new Discord.MessageEmbed()
    .setColor(client.config.color)
    .setDescription(i18n.__("command.ship.errors.nottwomembers"));

    const Err = new Discord.MessageEmbed()
    .setColor(client.config.color)
    .setDescription(i18n.__("command.ship.errors.error"));

    let user1ID;
    let user2ID;
    let user1;
    let user2;
    let avatar1;
    let avatar2;

    if(!args[0] && !args[1]) return message.channel.send(message.author, NotTwoMembers)
    if(args[0].startsWith('<@!') && args[0].endsWith('>')) {
        user1ID = args[0].slice(3, -1);
    }

    if(args[1].startsWith('<@!') && args[1].endsWith('>')) {
        user2ID = args[1].slice(3, -1);
    };

    if(user1ID) {
        user1 = message.guild.members.cache.get(user1ID).user;
    };

    if(user2ID) {
        user2 = message.guild.members.cache.get(user2ID).user;
    };

    if(user1) {
        avatar1 = user1.displayAvatarURL() + '?size=256';
    }

    if(user2) {
        avatar2 = user2.displayAvatarURL() + '?size=256';
    }

    message.channel.startTyping();
    fetch(`https://nekobot.xyz/api/imagegen?type=ship&user1=${avatar1}&user2=${avatar2}`)
        .then(res => res.json())
        .then(data => message.channel.send(message.author, new Discord.MessageAttachment(data.message)))
        .catch(err => {
            message.channel.stopTyping(true);
            return message.channel.send(message.author, Err)
        });
    message.channel.stopTyping(true);
};

exports.config = {
    name: 'ship',
    enabled: true,
	guildOnly: true,
    aliases: ['shippar', 'casal'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'ship',
	category: 'Diversão',
	description: 'Shippa duas pessoas',
	usage: 'ship {@membro} {@membro2}'
};