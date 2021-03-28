const { play } = require("../../modules/utilPlay.js");
const YouTubeAPI = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const { getTracks, getPreview } = require("spotify-url-info");

const { YOUTUBE_API_KEY, MAX_PLAYLIST_SIZE, SOUNDCLOUD_CLIENT_ID, DEFAULT_VOLUME } = require("../../modules/music.js");

const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

exports.run = async (Discord, client, message, args, i18n) => {
	const { channel } = message.member.voice;
    const serverQueue = message.client.queue.get(message.guild.id);

    if (!args.length)
    return message
    .channel.send(client.embed(i18n.__mf("command.playlist.errors.noargs", {prefix: client.config.prefix})))
    .catch(console.error);
    if (!channel) return message.channel.send(client.embed(i18n.__("command.playlist.errors.nochannel"))).catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) return message.channel.send(client.embed(i18n.__("command.playlist.errors.noperms.CONNECT")));
    if (!permissions.has("SPEAK")) return message.channel.send(client.embed(client.embed(i18n.__("command.playlist.errors.noperms.SPEAK"))));

    if (serverQueue && channel !== message.guild.me.voice.channel)
    return message.channel
	.send(client.embed(i18n.__("command.playlist.errors.notsamechannel")))
    .catch(console.error);

    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
	const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
    const spotifyPlaylistRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:playlist\/|\?uri=spotify:plylist:)((\w|-){22})(?:(?=\?)(?:[?&]foo=(\d*)(?=[&#]|$)|(?![?&]foo=)[^#])+)?(?=#|$)/;
    const url = args[0];
    const urlValid = pattern.test(args[0]);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: DEFAULT_VOLUME || 100,
      playing: true,
	  firstRequestBy: message.author,
    };

    let playlist;
    let videos = [];

    if (urlValid) {
      	try {
        	playlist = await youtube.getPlaylist(url, { part: "snippet" });
	        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      	} catch (error) {
        	console.error(error);
	        return message.channel.send(client.embed(i18n.__("command.playlist.errors.playlist_notfound"))).catch(console.error);
      	}
    } else if(spotifyPlaylistRegex.test(args[0])) {

        return message.channel.send(client.embed(`<:youtube:815768355713056788> | ${i18n.__("command.play.errors.notValidSource")}`))
        
    } else {
    	try {
	        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        	playlist = results[0];
        	videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      	} catch (error) {
	        console.error(error);
        	return message.channel.send(client.embed(i18n.__("command.playlist.errors.error"))).catch(console.error);
      	}
    }

    let newSongs;

    if(playlist.title === 'Spotify') {
        newSongs = videos.filter((video) => video.name != "Private video" && video.title != "Deleted video")
        .map((video) => {
            return (song = {
          	    title: video.title,
          	    url: video.url,
              	duration: video.durationSeconds,
            });
        });
    } else {
        newSongs = videos.filter((video) => video.title != "Private video" && video.title != "Deleted video")
        .map((video) => {
            return (song = {
          	    title: video.title,
          	    url: video.url,
              	duration: video.durationSeconds,
            });
        });
    }

    serverQueue ? serverQueue.songs.push(...newSongs) : queueConstruct.songs.push(...newSongs);

    let playlistEmbed = new Discord.MessageEmbed()
    	.setTitle(`${playlist.title}`)
    	.setDescription(newSongs.map((song, index) => `${index + 1}. ${song.title}`))
      	.setURL(playlist.url)
      	.setColor('#8855ff')

    if (playlistEmbed.description.length >= 2048)
	    playlistEmbed.description =
        playlistEmbed.description.substr(0, 2007) + `\n${i18n.__("command.playlist.errors.playlistTooLong")}`;

    message.channel.send(`${message.author}, ${i18n.__("command.playlist.responses.playlistAddedToQueue")} \n`, playlistEmbed);

    if (!serverQueue) {
      	message.client.queue.set(message.guild.id, queueConstruct);

      	try {
        	queueConstruct.connection = await channel.join();
        	await queueConstruct.connection.voice.setSelfDeaf(true);
        	play(queueConstruct.songs[0], message, client, i18n);
			message.channel.stopTyping(true);
      } catch (error) {
        	console.error(error);
			message.channel.stopTyping(true);
        	message.client.queue.delete(message.guild.id);
        	await channel.leave();
        	return message.channel.send(client.embed(`${i18n.__("command.playlist.errors.thereIsAnError")}\n ${error}`)).catch(console.error);
      };
	}
};

exports.config = {
    name: 'playlist',
    enabled: true,
	guildOnly: true,
    aliases: ['pl'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'playlist',
	category: 'Música',
	description: 'Reproduz uma playlist do youtube',
	usage: 'playlist {Nome da playlist | URL da playlist}'
};