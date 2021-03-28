const env = require('dotenv').config().parsed;
const Enmap = require("enmap");

const config = {
    ownerID: "292065674338107393",
    prefix: "n!",
    color: "#2F3136",
    colorError: "#8850ff",
    token: env.BOT_TOKEN,
    oauth: env.DISCORD_OAUTH,
    callbackURL: "https://noid.one/callback",
    invitePerm: "8",
    topggPost: true,
    topgg_token: env.TOPGG_TOKEN,
    categories: ['support', 'levelling', 'economy', 'fun', 'bot', 'onlydev', 'moderation', 'music', 'miscellaneous'],
    music: {
      youtube_api_key: env.YOUTUBE_API_KEY,
      soundcloud_client_id: env.SOUNDCLOUD_CLIENT_ID,
      max_playlist_size: 50,
      prunning: false,
      stay_time: 84600,
      default_volume: 60,
    },
    bot_guild: {
      id: "782722663549763585",
      suggestion_channel: "792860624865591337",
      report_global_channel: "789903205361254421",
      logs_channel: "792860686672724009",
      todo_channel: "796597396758462494",
    },
    api: {
      apps: new Enmap({name: 'api_apps'}),
      tokens: new Enmap({name: 'api_tokens'})
    },
    default: {
      user_settings: {
          profile: {
            realName: null,
            bio: null,
            birthday: null,
            email: null,
            cardBackground: null,
            siteProfileBackground: null,
            role: null,
            relation_ship: null, 
            lastVote: null,
            money: 0,
            logs: [],
            gifts: [],
            fav_songs: [],
            store_items: [],
            inventory: [],
            reps: 0,
            hugs: 0,
            kisses: 0,
            votes: 0,
            gvotes: 0,
          },
          api: {
            access: false,
            token: null,
          },
          isGuildChecked: false,
          isPremium: false,
          isStaff: false,
          veteranGuildOwner: false,
          rep_timeout: null,
      },
      guild_settings: {
        id: null,
        custom_configs: {
          prefix: 'n!',
          lang: 'pt_br',
          welcome_channelID: null,
          welcome_message: null,
          welcome_roleID: null,
          levels: false,
          levelup_channelID: null,
          level_blacklistedChannels: [],
          toDoChannelID: null,
          secondToDoChannelID: null,
          custom_upvotes_emojiID: null,
          custom_downvote_emojiID: null,
          custom_approved_emojiID: null,
          suggestionChannelID: null,
          suggestionApproveRoles: null,
          memberCounterText: null,
          memberCountChannel: null,
          minimumSuggestionVotesToApprove: 10,
        },
        profile: {
          show: true,
          owners: [],
          short_description: null,
          description: null,
          keywords: [],
          tags: [],
          upvotes: 0,
          invite: null,
          isPremium: false,
          isBoosted: false,
          isVerified: false,
          custom_invite: null,
          theme_color: '#2F3136',
          background_image: null,
          store: false,
          store_items: [
            /* Object example
              {
                type: null, //ROLE, BACKGROUND (Cargo ou Plano de fundo pro n!profile)
                id: null,
                guild: guildID,
                avaliable: true,
                description: null,
                price: null,
                roleID: null,
                cardBackgroundURL: null,
                createdAt: null,
                min_lvl: null,
                buyLimit: null,
              }
            */
          ]
        },
        stats: []
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
      user_stats: {
        messages_sent: 0,
        used_commands: 0,
        gifts_gave: 0,
        invites: 0,
        spoke_time: null,
      },
      guild_stats: {
        messages_sent: 0,
        used_commands: 0,
        newMembers: 0,
        offMembers: 0,
        addedReactions: 0,
        spoke_time: null,
      }
    },
    website: {
      invite: 'https://discord.com/api/oauth2/authorize?client_id=778753927369850880&permissions=1073605873&scope=bot',
      support_server_invite: 'https://discord.gg/GtaxXxNYaD',
      description: 'O bot NoIdentity possibilita que você tenha todos os recursos de um bot pago de forma gratuita.',
      link: 'noid.one',
      patreon: 'https://patreon.com/noidentity'
    },
    start: {
      presence: {
        status: "online", //online, idle, dnd, offline
        texts: [`música à todos!`, `diversão para meus usuários!`, `vote em Top.gg`, `tenha um ótimo dia!`, `meu prefixo [n!]`, `noid.one`], // Texto apresentado como status do bot em seu perfil.
        type: "STREAMING", //PLAYING, STREAMING, LISTENING, WATCHING, CUSTOM_STATUS
        url: "https://www.twitch.tv/jurgenjacobsen"
      }
    },
    crew: ['292065674338107393', '660654224140533760', '362747869851287554'],
    blockedlist: ['693602776919572522', '401544403610501122'],
    projects: ['778753927369850880', '658769279079940157', '822202087165001799', '822221031481540679']
  };

module.exports = config;