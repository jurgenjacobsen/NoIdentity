const ytdl = require("ytdl-core-discord");
const scdl = require("soundcloud-downloader").default;
const Discord = require("discord.js");
const { canModifyQueue, STAY_TIME} = require("./music.js");

module.exports = {
  async play(song, message, client, i18n) {
    const { SOUNDCLOUD_CLIENT_ID } = require("./music.js");

    let config;

    try {
      config = require("../config.js");
    } catch (error) {
      config = null;
    }

    const PRUNING = config.music.prunning;

    const queue = message.client.queue.get(message.guild.id);

    if (!song) {
      setTimeout(function () {
        if(queue.connection.dispatcher && message.guild.me.voice.channel) return;
        //queue.channel.leave();

        let endEmbed = new Discord.MessageEmbed()
        .setColor("#8855ff")
        .setDescription(i18n.__("modules.utilPlay.thanks"))
        .addField(i18n.__("modules.utilPlay.likeMe"), i18n.__("modules.utilPlay.stoppedNonPremium"))
        .setImage("https://noid.one/assets/images/patreon_banner_noid.png");
        //queue.textChannel.send(endEmbed).catch(console.error);

      }, config.music.stay_time * 100000);

      if(queue) {
        if(queue.songs.length >= 1) {    
          queue.textChannel.send(client.embed(`${queue.firstRequestBy} ${i18n.__("modules.utilPlay.songNotFound")} <:worker:804839799374610482>`).setColor('#8855ff')).catch(console.error);
        };
      }

      return message.client.queue.delete(message.guild.id);
    }

    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdl(song.url, { highWaterMark: 1 << 25 });
      } else if (song.url.includes("soundcloud.com")) {
        try {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, SOUNDCLOUD_CLIENT_ID);
        } catch (error) {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, SOUNDCLOUD_CLIENT_ID);
          streamType = "unknown";
        }
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message, client, i18n);
      }

      console.error(error);
      return message.channel.send(client.embed(i18n.__("modules.utilPlay.errors.error")));
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const dispatcher = queue.connection
      .play(stream, { type: streamType })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message, client, i18n);
        } else {
          queue.songs.shift();
          module.exports.play(queue.songs[0], message, client, i18n);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message, client, i18n);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    try {
      let a1embed = client.embed(i18n.__mf("modules.utilPlay.startPlaying", {songTitle: song.title, songUrl: song.url})).setColor('#8855ff');
      var playingMessage = await queue.textChannel.send(a1embed);
      await playingMessage.react("⏭");
      await playingMessage.react("⏯");
      await playingMessage.react("🔇");
      await playingMessage.react("🔉");
      await playingMessage.react("🔊");
      await playingMessage.react("🔁");
      await playingMessage.react("⏹");
      await playingMessage.react("⭐");
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);

      let embed3x = client.embed(i18n.__("modules.utilPlay.errors.notinsamechannel"));

      switch (reaction.emoji.name) {
        case "⏭":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return message.channel.send(user, embed3x);
          queue.connection.dispatcher.end();
          queue.textChannel.send(client.embed(`${user} ${i18n.__("modules.utilPlay.skippedSong")}`).setColor('#8855ff')).catch(console.error);
          collector.stop();
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return message.channel.send(user, embed3x);
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            queue.textChannel.send(client.embed(`${user} ${i18n.__("modules.utilPlay.pausedSong")}`).setColor('#8855ff')).catch(console.error);
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            queue.textChannel.send(client.embed(`${user} ${i18n.__("modules.utilPlay.unPausedSong")}`).setColor('#8855ff')).catch(console.error);
          }
          break;

        case "🔇":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return message.channel.send(user, embed3x);
          if (queue.volume <= 0) {
            queue.volume = 100;
            queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
            queue.textChannel.send(client.embed(`${user} ${i18n.__("modules.utilPlay.unMutedSong")}`).setColor('#8855ff')).catch(console.error);
          } else {
            queue.volume = 0;
            queue.connection.dispatcher.setVolumeLogarithmic(0);
            queue.textChannel.send(client.embed(`${user} ${i18n.__("modules.utilPlay.mutedSong")}`).setColor('#8855ff')).catch(console.error);
          }
          break;

        case "🔉":
          reaction.users.remove(user).catch(console.error);
          if (queue.volume == 0) return;
          if (!canModifyQueue(member)) return message.channel.send(user, embed3x);
          if (queue.volume - 10 <= 0) queue.volume = 0;
          else queue.volume = queue.volume - 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel
            .send(client.embed(`${user} ${i18n.__mf("modules.utilPlay.decreasedVolume", {queueVolume: queue.volume})}`).setColor('#8855ff'))
            .catch(console.error);
          break;

        case "🔊":
          reaction.users.remove(user).catch(console.error);
          if (queue.volume == 100) return;
          if (queue.volume == 0) return;
          if (!canModifyQueue(member)) return message.channel.send(user, embed3x);
          if (queue.volume + 10 >= 100) queue.volume = 100;
          else queue.volume = queue.volume + 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel
            .send(client.embed(`${user} ${i18n.__mf("modules.utilPlay.increasedVolume", {queueVolume: queue.volume})}`).setColor('#8855ff'))
            .catch(console.error);
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return message.channel.send(user, embed3x);
          queue.loop = !queue.loop;
          queue.textChannel
            .send(client.embed(`${user} ${i18n.__mf("modules.utilPlay.loopMode.text", {
              queueLoopMode: queue.loop ? i18n.__("modules.utilPlay.loopMode.on") : i18n.__("modules.utilPlay.loopMode.off")
            })}!`).setColor('#8855ff'))
            .catch(console.error);
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return message.channel.send(user, embed3x);
          queue.songs = [];
          let stopEmbed = new Discord.MessageEmbed()
          .setColor("#8855ff")
          .setDescription(i18n.__("modules.utilPlay.thanks"))
          .addField(i18n.__("modules.utilPlay.likeMe"), i18n.__("modules.utilPlay.stoppedNonPremium"))
          .setImage("https://noid.one/assets/images/patreon_banner_noid.png");

          queue.textChannel.send(stopEmbed).catch(console.error);
          
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;
        case "⭐":
          reaction.users.remove(user).catch(console.error);

          client.usersdata.ensure(user.id, client.config.default.user_settings);
          let x = [];
          let fav_songs = client.usersdata.get(user.id).profile.fav_songs;

          let np = queue.songs[0];

          fav_songs.map(y => {
              if(y.url === np.url) {
                x.push(true);
              }
          });

          if(x.length === 0) {
            client.usersdata.push(user.id, np, 'profile.fav_songs');
            queue.textChannel.send(client.embed(`${user} ${i18n.__("modules.utilPlay.favedSong")}`).setColor('#8855ff')).catch(console.error);
          }

        break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (PRUNING && playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }
};
