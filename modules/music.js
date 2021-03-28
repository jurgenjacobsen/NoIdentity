exports.canModifyQueue = (member) => {
    const { channelID } = member.voice;
    const botChannel = member.guild.voice.channelID;
  
    if (channelID !== botChannel) {
      return;
    }
  
    return true;
  };
  
  let config;
  
  try {
    config = require("../config.js");
  } catch (error) {
    config = null;
  }
  
  exports.YOUTUBE_API_KEY = config.music.youtube_api_key;
  exports.SOUNDCLOUD_CLIENT_ID = config.music.soundcloud_client_id;
  exports.MAX_PLAYLIST_SIZE = config.music.max_playlist_size;
  exports.PRUNING = config.music.prunning;
  exports.STAY_TIME = config.music.stay_time;
  exports.DEFAULT_VOLUME = config.music.default_volume;