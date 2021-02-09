const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const ytsr = require('ytsr');

module.exports = async client => {

    client.queue = new Map();

    client.on('music', (message, command, args) => {

    });

    client.execute = async (message, serverQueue) => {
        const args = message.content.split(" ");
      
        const voiceChannel = message.member.voice.channel;

        const Embed1 = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`*Você deve estar em um canal de voz para escutar música*!`);

        const Embed2 = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`*Preciso de permissões para conectar e falar neste canal de voz*!`);

        if (!voiceChannel) return message.channel.send(message.author, Embed1);

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
          return message.channel.send(message.author, Embed2);
        }
      
        let songInfo = await ytsr(args.join(' '), {limit: 1});
        songInfo = songInfo.items[0];
        const song = songInfo;
      
        if (!serverQueue) {
          const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
          };
      
          client.queue.set(message.guild.id, queueContruct);
      
          queueContruct.songs.push(song);
      
          try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            client.play(message.guild, queueContruct.songs[0], message);
          } catch (err) {
            console.log(err);
            client.queue.delete(message.guild.id);
            return message.channel.send(err);
          }
        } else {
          serverQueue.songs.push(song);
          const Embed3 = new Discord.MessageEmbed()
          .setColor(client.config.color)
          .setDescription(`*${song.title}* foi adicionado à lista de reprodução!`);
          return message.channel.send(message.author, Embed3);
        };       
      };

    client.skip = (message, serverQueue) => {
        const Embed4 = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`*Você deve estar em um canal de voz para isto*!`);
        const Embed5 = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`*Não há nada tocando*!`);

        if (!message.member.voice.channel)  return message.channel.send(message.author, Embed4);
        if (!serverQueue)   return message.channel.send(message.author, Embed5);

        const Skipped = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`**${serverQueue.songs[0].title}** foi passado!`);
        message.channel.send(message.author, Skipped);

        client.emit('songSkipped', serverQueue);

        serverQueue.connection.dispatcher.end();
    };

    client.stop = (message, serverQueue) => {
        const Embed4 = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`*Você deve estar em um canal de voz para isto*!`);
        const Embed5 = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`*Não há nada tocando*!`);

        if (!message.member.voice.channel)
            return message.channel.send(message.author, Embed4);
        if (!serverQueue)
            return message.channel.send(message.author, Embed5);
        
        const Stopped = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`A lista de reprodução foi limpa!`);
        message.channel.send(message.author, Stopped);

        client.emit('songStopped', serverQueue);

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }

    client.play = (guild, song, message) => {
        const serverQueue = client.queue.get(guild.id);
        if (!song) {
            client.queue.delete(guild.id);
            return;
        }
      
        const dispatcher = serverQueue.connection
          .play(ytdl(song.url))
          .on("finish", () => {
            serverQueue.songs.shift();
            client.play(guild, serverQueue.songs[0], message);
          })
          .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

        const Embed7 = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`Começando a tocar **${song.title}** - *${song.duration}*`);

        serverQueue.textChannel.send(message.author, Embed7);
    }

    client.isPlaying = (guildID) => {

      const serverQueue = client.queue.get(guildID);

      if(serverQueue) {
        if(serverQueue.length === 0) {
          return false;
        } else {
          return true;
        };
      } else {
        return false;
      }
    };

    client.getQueue = (guildID) => {
      if(client.isPlaying(guildID)) {
        return client.queue.get(guildID);
      } else {
        return null;
      }
    }

    client.log(`LOAD`, `Funções de música carregada!`);
};