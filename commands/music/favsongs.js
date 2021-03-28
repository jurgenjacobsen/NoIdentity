
exports.run = async (Discord, client, message, args, i18n) => {

    const permissions = message.channel.permissionsFor(message.client.user);
    if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"]))
    return message.channel.send(client.embed(i18n.__("command.queue.errors.noPerm")));

    let user = message.mentions.members.first() || message.author;
                client.usersdata.ensure(user.id, client.config.default.user_settings);
    const songs = client.usersdata.get(user.id).profile.fav_songs;
    
    if(songs.length === 0) return message.channel.send(message.author, client.embed(i18n.__("command.favsongs.errors.zeroSongs")))

    let currentPage = 0;
    const embeds = generateQueueEmbed(message, songs);

    const favListEmbed = await message.channel.send(
      `${i18n.__mf("command.queue.responses.actualPage", {
        currentPage: currentPage + 1,
        embedLength: embeds.length
      })}`,
      embeds[currentPage]
    );

    try {
      await favListEmbed.react("⬅️");
      await favListEmbed.react("⏹");
      await favListEmbed.react("➡️");
    } catch (error) {
      console.error(error);
      message.channel.send(error.message).catch(console.error);
    }

    const filter = (reaction, user) =>
    ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;

    const collector = favListEmbed.createReactionCollector(filter, { time: 160000 });

    collector.on("collect", async (reaction, user) => {
        try {
          if (reaction.emoji.name === "➡️") {
            if (currentPage < embeds.length - 1) {
              currentPage++;
              favListEmbed.edit(
                `${i18n.__mf("command.queue.responses.actualPage", {
                  currentPage: currentPage + 1,
                  embedLength: embeds.length
                })}`,
                    embeds[currentPage]
              );
            }
          } else if (reaction.emoji.name === "⬅️") {
            if (currentPage !== 0) {
              --currentPage;
              favListEmbed.edit(
                `${i18n.__mf("command.queue.responses.actualPage", {
                  currentPage: currentPage + 1,
                  embedLength: embeds.length
                })}`,
                    embeds[currentPage]
              );
            }
          } else if(reaction.emoji.name === "⏹") {
            collector.stop();
            reaction.message.reactions.removeAll();
          }
          await reaction.users.remove(message.author.id);
        } catch (error) {
          console.error(error);
          return message.channel.send(error.message).catch(console.error);
        }
      });

    function generateQueueEmbed(message, songs) {
		let embeds = [];
		let k = 10;
	  
		for (let i = 0; i < songs.length; i += 10) {
		  const current = songs.slice(i, k);
		  let j = i;
		  k += 10;

          const info = current.map((song) => `${++j} - [${song.title}](${song.url})`).join("\n");

		  const embed = new Discord.MessageEmbed()
			.setTitle(`⭐ | ${i18n.__("command.favsongs.responses.title")} \n`)
			.setColor('#8855ff')
      .setDescription(info);
		  embeds.push(embed);
		}
	  
		return embeds;
	}
};
 
exports.config = {
    name: 'favsongs',
    enabled: true,
    guildOnly: true,
    aliases: ['musicasfav', 'favoritas', 'favorites', 'favs'],
    permissions: ['SEND_MESSAGES']
};
 
exports.help = {
    name: 'favsongs',
    category: "Música",
    description: "Mostra suas músicas favoritas",
    usage: "favsongs"
};