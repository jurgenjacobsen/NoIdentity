const env = require('dotenv').config().parsed;
const Enmap = require("enmap");

const config = {
    ownerID: "292065674338107393",
    prefix: "n!",
    color: "#2F3136",
    colorError: "#8850ff",
    token: env.BOT_TOKEN,
    oauth: env.DISCORD_OAUTH,
    callbackURL: "http://localhost:80/callback",
    invitePerm: "8",
    dblActive: true,
    dbl_token: env.DBL_TOKEN,
    bot_guild: {
      id: "782722663549763585",
      suggestion_channel: "792860624865591337",
      report_global_channel: "789903205361254421",
      logs_channel: "792860686672724009",
    },
    api: {
      apps: new Enmap({name: "apps", fetchAll: false, autoFetch: true, cloneLevel: "deep"}),
    },
    default: {
      user_settings: {
        profile: {
          realName: null,
            bio: null,
            birthday: null,
            role: null,
          },
          api: {
            access: false,
            token: null,
          },
          isGuildChecked: false,
          isPremium: false,
          isStaff: false,
      },
      guild_settings: {
        custom_configs: {
          prefix: `n!`,
          lang: 'pt-br',
          radio_channelID: null,
          report_channelID: null,
          welcome_channelID: null,
          welcome_message: null,
          welcome_roleID: null,
          news_channelID: null,
        },
        lists: {
          blacklist: [],
        },
        profile: {
          owners: [],
          short_description: null,
          description: null,
          keywords: [],
          upvotes: null,
          rates: 0.0,
          invite: null,
          short_invite: null,
          isPremium: false,
          isBoosted: false,
          show: false,
          theme_color: '#2F3136',
        },
      },
      app_settings: {
        name: null,
        id: null,
        token: null,
        createdAt: null,
        iconURL: null,
        owners: [],
      },
      stats: {
        ran_commands: 1,
        songs_listened: 1,
      },
      suggestion: {
        id: null,
        content: null,
        author: null,
        upvotes: 0,
        downvotes: 0,
        approved: false,
      },
    },
    website: {
      invite: 'https://discord.com/api/oauth2/authorize?client_id=778753927369850880&permissions=1073605873&scope=bot',
      support_server_invite: 'https://discord.gg/GtaxXxNYaD',
      description: 'O bot NoIdentity possibilita que você tenha todos os recursos de um bot pago de forma gratuita.',
      link: 'localhost',
      patreon: 'https://patreon.com/noidentity'
    },
    start: {
      presence: {
        status: "online", //online, idle, dnd, offline
        text: "em manutenção", // Texto apresentado como status do bot em seu perfil.
        type: "STREAMING", //PLAYING, STREAMING, LISTENING, WATCHING, CUSTOM_STATUS
        url: "https://www.twitch.tv/jurgenjacobsen"
      }
    },
    staff: ['292065674338107393', '291320680723644417'],
  };

  module.exports = config;