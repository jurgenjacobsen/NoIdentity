const createBar = require(`string-progressbar`);

exports.run = async (Discord, client, message, args, i18n) => {
    const queue = message.client.queue.get(message.guild.id); 
	  let Notqueue = client.embed(i18n.__("command.nowplaying.errors.noqueue"))
    if (!queue) return message.channel.send(message.author, Notqueue).catch(console.error);

    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;

    let nowPlaying = new Discord.MessageEmbed()
    .setTitle(i18n.__("command.nowplaying.responses.playing"))
    .setDescription(`**${song.title}**\n\n${song.url}`)
    .setColor('#8855ff');

    if (song.duration > 0) {
      nowPlaying.addField(
        "\u200b",
        new Date(seek * 1000).toISOString().substr(11, 8) +
          "[" +
          createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
          "]" +
          (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
        false
      );
      nowPlaying.setFooter(`${i18n.__("command.nowplaying.responses.remain_time")} ${new Date(left * 1000).toISOString().substr(11, 8)}`);
    }

    return message.channel.send(message.author, nowPlaying);
};

exports.config = {
    name: 'nowplaying',
    enabled: true,
	  guildOnly: true,
    aliases: ['np'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'nowplaying',
	category: 'Música',
	description: 'Mostra música em reprodução.',
	usage: 'np'
};