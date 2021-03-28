const { canModifyQueue} = require("../../modules/music.js");

exports.run = async (Discord, client, message, args, i18n) => {

	if (!args.length || isNaN(args[0]))
      return message.channel
	  	.send(client.embed(i18n.__("command.skipto.errors.how")))
        .catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(client.embed(i18n.__("command.skipto.errors.noqueue"))).catch(console.error);
    if (!canModifyQueue(message.member)) return message.channel.send(client.embed(client.embed("command.skipto.errors.notinsamechannel")));

    if(isNaN(args[0])) return message.channel.send(client.embed(i18n.__("command.skipto.errors.isntnumber")));

    if(args[0].startsWith('-') || args[0] === '0' || args[0] === '1') return message.channel.send(client.embed(i18n.__mf("command.skipto.errors.noargs", {
      queueLength: queue.songs.length
    })));

    if (args[0] > queue.songs.length)
        return message.channel
	  	  .send(client.embed(i18n.__mf("command.skipto.errors.noargs", {
          queueLength: queue.songs.length
        })))
        .catch(console.error);

      if (args[0] == queue.songs.length) return message.channel
	  	.send(client.embed(i18n.__mf("command.skipto.errors.cant")))
      .catch(console.error);
    

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 1; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }

    queue.connection.dispatcher.end();
    queue.textChannel
      .send(client.embed(`${message.author} ${i18n.__mf("command.skipto.responses.description", {
        songSkipped: args[0] - 2,
      })}`).setColor('#8855ff'))
      .catch(console.error);
};

exports.config = {
  name: 'skipto',
  enabled: true,
	guildOnly: true,
  aliases: ['st'],
  permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'skipto',
	category: 'Música',
	description: 'Pula para uma determinada posição na fila.',
	usage: 'skipto {número da música na playlist}'
};