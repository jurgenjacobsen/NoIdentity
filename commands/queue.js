exports.run = async (Discord, client, message, args) => {
    const queue = client.getQueue(message.guild.id);

    if(queue) {
    
        const playing = queue.songs[0];

        const Embed = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`
            **Lista de reprodução**\n
            Tocando agora: *${playing.title}*\n\n`
            + 
            queue.songs.map((song, i) => {
               return  `**#${i + 1}** - ${song.title} | ${song.duration}`
            }).slice(1, 5).join('\n')
            +
            `\n\n ${queue.songs.length > 5 ? `E outras **${queue.songs.length - 5}** músicas...` : `Na lista de reprodução **${queue.songs.length}** músicas...`}`);

        message.channel.send(message.author, Embed);

    } else {
        const Embed = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`*Não há nada tocando*!`);
        message.channel.send(message.author, Embed);
    }
};

exports.config = {
    name: 'queue',
    enabled: true,
	guildOnly: true,
    aliases: [],
    permissions: ['SEND_MESSAGES', 'CONNECT', 'SPEAK']
};

exports.help = {
	name: 'queue',
	category: 'Música',
	description: 'Mostra a lista de reprodução',
	usage: 'queue'
};