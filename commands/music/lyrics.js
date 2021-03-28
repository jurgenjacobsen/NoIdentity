const lyricsFinder = require("lyrics-finder");

exports.run = async (Discord, client, message, args, i18n) => {
	
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(client.embed(i18n.__("command.lyrics.errors.noqueue"))).catch(console.error);

    let lyrics = null;
    const title = queue.songs[0].title;
    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = `${i18n.__mf("command.lyrics.errors.notfound", { title: title })}`;
    } catch (error) {
      lyrics = `${i18n.__mf("command.lyrics.errors.notfound", { title: title })}`;
    }

    let lyricsEmbed = new Discord.MessageEmbed()
      .setTitle(`${i18n.__mf("command.lyrics.response.title", { title: title })}`)
      .setDescription(lyrics)
      .setColor('#8855ff')

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
};

exports.config = {
    name: 'lyrics',
    enabled: true,
	  guildOnly: true,
    aliases: ['letra', 'ly'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'lyrics',
	category: 'Música',
	description: 'Mostra a letra da música que está reproduzindo.',
	usage: 'lyrics'
};