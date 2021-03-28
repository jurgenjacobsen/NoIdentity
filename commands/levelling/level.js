exports.run = async (Discord, client, message, args, i18n) => {
	const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

	const key = `${message.guild.id}-${member.id}`;

    var points = client.points.get(key, "points");
    var level = client.points.get(key, "level");

    let e = client.embed(`${member} ` + i18n.__mf("command.level.responses.description", {
        points: points,
        level: level
    }))
    return message.channel.send(message.author, e);
};

exports.config = {
    name: 'level',
    enabled: true,
	guildOnly: true,
    aliases: ['nivel', 'pontos', 'points'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'level',
	category: 'Níveis',
	description: 'Mostra seu nível e pontos no servidor.',
	usage: 'level'
};