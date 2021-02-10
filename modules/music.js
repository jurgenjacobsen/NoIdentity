const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const ytsr = require('ytsr');

module.exports = async client => {

    client.queue = new Map();

    client.on('music', (message, command, args) => {

    });

    client.execute = async (message, serverQueue, request) => {
      let prefix;

      if(message.guild) {
        if(client.settings.get(message.guild.id).custom_configs.prefix) {
            prefix = client.settings.get(message.guild.id).custom_configs.prefix;
        } else {
            prefix = client.config.prefix;
        };
      } else {
        prefix = client.config.prefix
      };

      const voiceChannel = message.member.voice.channel;

      const Embed1 = new Discord.MessageEmbed().setColor(client.config.color).setDescription(`*Você deve estar em um canal de voz para escutar música*!`);
      const Embed2 = new Discord.MessageEmbed().setColor(client.config.color).setDescription(`*Preciso de permissões para conectar e falar neste canal de voz*!`);
      const Embed22 = new Discord.MessageEmbed().setColor(client.config.color).setDescription(`*Ainda não aceito playlists do youtube, caso você queira você pode escutar vídeos e lives*!`);
      const Embed23 = new Discord.MessageEmbed().setColor(client.config.color).setDescription(`*Este vídeo ainda não está disponível para ser assistido*!`);
      const Embed24 = new Discord.MessageEmbed().setColor(client.config.color).setDescription(`*Você deve estar no mesmo canal de voz que eu*!`);

      if(!voiceChannel) return message.channel.send(message.author, Embed1);
      if(message.guild.voice.channel && message.guild.voice.channel.id !== voiceChannel.id) return message.channel.send(message.author, Embed24);

      const permissions = voiceChannel.permissionsFor(message.client.user);
      if(!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(message.author, Embed2);
      };

      const moment = require('moment'); require('moment-duration-format');
            moment.locale('pt-br');
      
      let songInfo; 
        if(ytdl.validateURL(request)) {
          songInfo = await ytdl.getBasicInfo(request);
          songInfo = songInfo.videoDetails;
          songInfo = {
            title: songInfo.title, //
            type: songInfo.type, //
            url: songInfo.video_url, //
            views: songInfo.viewCount, //
            duration: songInfo.duration,
            author: {
             name: songInfo.author.name //
            },
            isLive: songInfo.isLiveContent, //
            isUpcoming: null,
            uploadedAt: moment(songInfo.uploadDate).fromNow()
          };
        } else {
          songInfo= await ytsr(request, {limit: 1, gl: 'BR', hl: 'pt-br'});
          songInfo = songInfo.items[0];
          songInfo = {
            title: songInfo.title,
            type: songInfo.type,
            url: songInfo.url,
            views: songInfo.views,
            duration: songInfo.duration,
            author: {
             name: songInfo.author.name
            },
            isLive: songInfo.isLive,
            isUpcoming: songInfo.isUpcoming,
            uploadedAt: songInfo.uploadedAt
          };
        };

      if(songInfo.type === 'playlist') return message.channel.send(message.author, Embed22);
      if(songInfo.isUpcoming === true) return message.channel.send(message.author, Embed23);

      const song = songInfo;
      
      if(!serverQueue) {
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
        const Embed3 = new Discord.MessageEmbed().setColor(client.config.color).setDescription(`**${song.title}** foi adicionado à lista de reprodução!`);
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

          if(!message.member.voice.channel) return message.channel.send(message.author, Embed4);
          if(!serverQueue) return message.channel.send(message.author, Embed5);

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

        if(!message.member.voice.channel) return message.channel.send(message.author, Embed4);
        if(!serverQueue) return message.channel.send(message.author, Embed5);
        
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

        const stream = ytdl(song.url, {
          quality: 'highest',
          dlChunkSize: 0,
          highWaterMark: 1 << 25,
        });
      
        const dispatcher = serverQueue.connection
          .play(stream)
          .on("finish", () => {
            serverQueue.songs.shift();
            client.play(guild, serverQueue.songs[0], message);
          })
          .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

        const Embed7 = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`Começando a tocar **${song.title}** ${song.duration ? `- *${song.duration}*` : ``}`);

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

    client.nowPlaying = (guildID) => {
      if(client.isPlaying(guildID)) {
        if(client.getQueue(guildID)) {
          return client.getQueue(guildID).songs[0];
        } else {
          return null;
        }
      } else {
        return null;
      }
    }

    client.log(`LOAD`, `Funções de música carregada!`);
};