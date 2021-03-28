
const { play } = require("../../modules/utilPlay.js");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const https = require("https");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID, DEFAULT_VOLUME } = require("../../modules/music.js");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const { getPreview } = require("spotify-url-info");

exports.run = async (Discord, client, message, args, i18n) => {

    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!channel) return message.channel.send(client.embed(i18n.__("command.play.errors.nochannel"))).catch(console.error);
    if (serverQueue && channel !== message.guild.me.voice.channel)
    return message.channel.send(client.embed(i18n.__("command.play.errors.notsamechannel")))
    .catch(console.error);

    if (!args.length)
      return message
      .channel.send(client.embed(i18n.__mf("command.play.errors.noargs", { prefix: client.config.prefix })))
      .catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) return message.channel.send(client.embed(i18n.__("command.play.errors.noperms.CONNECT")));
    if (!permissions.has("SPEAK")) return message.channel.send(client.embed(i18n.__("command.play.errors.noperms.SPEAK")));

    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
    const spotifyRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})(?:(?=\?)(?:[?&]foo=(\d*)(?=[&#]|$)|(?![?&]foo=)[^#])+)?(?=#|$)/;
    const spotifyPlaylistRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:playlist\/|\?uri=spotify:plylist:)((\w|-){22})(?:(?=\?)(?:[?&]foo=(\d*)(?=[&#]|$)|(?![?&]foo=)[^#])+)?(?=#|$)/;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    message.channel.startTyping();
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      message.channel.stopTyping(true);
      return message.client.commands.get("playlist").run(Discord, client, message, args, i18n);
    };

    if (mobileScRegex.test(url)) {
      try {
        https.get(url, function (res) {
          if (res.statusCode == "302") {
            return message.client.commands.get("play").run(Discord, client, message, [res.headers.location], i18n);
          } else {
            return message.channel.send(client.embed(i18n.__("command.play.errors.notfound"))).catch(console.error);
          }
        });
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
      return message.channel.send(client.embed(i18n.__("command.play.errors.redirecting"))).catch(console.error);
    }

    message.channel.stopTyping(true);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: DEFAULT_VOLUME || 60,
      playing: true,
      firstRequestBy: message.author,
    };

    let songInfo = null;
    let song = null;

    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else if(scRegex.test(url)) {
      
      message.channel.send(client.embed(`<:youtube:815768355713056788> | ${i18n.__("command.play.errors.notValidSource")}`))

    } else if(spotifyRegex.test(url)) {

      if(client.usersdata.get(message.author.id).isPremium) {
          let SpotifyResult = await getPreview(url);

          const results = await youtube.searchVideos(`${SpotifyResult['artist']} - ${SpotifyResult['title']}`, 1, { part: "snippet" });
          songInfo = await ytdl.getInfo(results[0].url);
  
          song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            duration: songInfo.videoDetails.lengthSeconds,
            isLive: songInfo.videoDetails.isLive,
          };

      } else {
        return message.channel.send(message.author, client.embed(i18n.__("command.play.errors.onlyForPremiums")).setColor('#8855ff'));
      }

    } else {
      try {
        const results = await youtube.searchVideos(search, 1, { part: "snippet" });

        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds,
          isLive: songInfo.videoDetails.isLive,
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }

    message.channel.stopTyping(true);

    if(song.isLive) {
      return message.channel.send(client.embed(i18n.__("modules.utilPlay.liveNotSupported")))
    };

    if (serverQueue) {
      serverQueue.songs.push(song);
      return serverQueue.textChannel
	  	.send(client.embed(`${i18n.__mf("command.play.responses.addedToQueue", {songTitle: song.title})} ${message.author}`).setColor('#8855ff'))
      .catch(console.error);
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      /* if(message.guild.voice.channelID) return await message.guild.voice.kick().then(() => {
        setTimeout(async function() {
          queueConstruct.connection = await channel.join();
          await queueConstruct.connection.voice.setSelfDeaf(true);
          play(queueConstruct.songs[0], message);
        }, 1000);
      });*/
      message.channel.stopTyping(true);
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message, client, i18n);
    } catch (error) {
      message.channel.stopTyping(true);
      console.error(error);
      message.channel.stopTyping(true);
      message.client.queue.delete(message.guild.id);
      return message.channel.send(client.embed(i18n.__("command.play.errors.channelNotFound"))).catch(console.error);
    }
};

exports.config = {
    name: 'play',
    enabled: true,
	  guildOnly: true,
    aliases: ['p'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'play',
	category: 'Música',
	description: 'Reproduz áudios do Youtube',
	usage: 'play <nome da musica | url>'
};