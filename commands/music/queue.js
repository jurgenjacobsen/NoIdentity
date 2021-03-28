exports.run = async (Discord, client, message, args, i18n) => {

    const permissions = message.channel.permissionsFor(message.client.user);
    if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"]))
      return message.channel.send(client.embed(i18n.__("command.queue.errors.noPerm")));

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(client.embed(i18n.__("command.queue.errors.noqueue")));

    let currentPage = 0;
    const embeds = generateQueueEmbed(message, queue.songs);

    const queueEmbed = await message.channel.send(
      `${i18n.__mf("command.queue.responses.actualPage", {
        currentPage: currentPage + 1,
        embedLength: embeds.length
      })}`,
      embeds[currentPage]
    );

    try {
      await queueEmbed.react("⬅️");
      await queueEmbed.react("⏹");
      await queueEmbed.react("➡️");
    } catch (error) {
      console.error(error);
      message.channel.send(error.message).catch(console.error);
    }

    const filter = (reaction, user) =>
      ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;
    const collector = queueEmbed.createReactionCollector(filter, { time: 160000 });

    collector.on("collect", async (reaction, user) => {
      try {
        if (reaction.emoji.name === "➡️") {
          if (currentPage < embeds.length - 1) {
            currentPage++;
            queueEmbed.edit(
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
            queueEmbed.edit(
              `${i18n.__mf("command.queue.responses.actualPage", {
                currentPage: currentPage + 1,
                embedLength: embeds.length
              })}`,
              	embeds[currentPage]
            );
          }
        } else {
          collector.stop();
          reaction.message.reactions.removeAll();
        }
        await reaction.users.remove(message.author.id);
      } catch (error) {
        console.error(error);
        return message.channel.send(error.message).catch(console.error);
      }
    });

	function generateQueueEmbed(message, queue) {
		let embeds = [];
		let k = 10;
	  
		for (let i = 0; i < queue.length; i += 10) {
		  const current = queue.slice(i, k);
		  let j = i;
		  k += 10;
	  
		  const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");
	  
		  const embed = new Discord.MessageEmbed()
			.setTitle(`${i18n.__("command.queue.responses.queueTitle")} \n`)
			.setColor('#8855ff')
			.setDescription(
				`${i18n.__mf("command.queue.responses.actualSong", {
          actualSongTitle: queue[0].title,
          actualSongURL: queue[0].url,
          Info: info,
        })}`
			)
		  embeds.push(embed);
		}
	  
		return embeds;
	  }
};

exports.config = {
    name: 'queue',
    enabled: true,
	  guildOnly: true,
    aliases: ['q'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'queue',
	category: 'Música',
	description: 'Mostra a playlist atual.',
	usage: 'queue'
};