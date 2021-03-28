// NPM Packages
const env = require('dotenv').config().parsed;

const Discord = require('discord.js');
const Topgg = require('@top-gg/sdk');

const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const { readdirSync } = require("fs");
const path = require('path');

const Enmap = require("enmap");
const i18n = require("i18n");
const Noid = require("noid-one-auth");

// Clients
const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION']});

/* const noid = new Noid(client, '778753927369850880', {
    log: true
}); */

// Configs

client.config = require('./config.js');
client.version = require('./package.json').version;
client.topgg = new Topgg.Api(client.config.topgg_token);

client.default = client.config.default;
client._api = client.config.api;
client.languages = [];

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.queue = new Map();

require('./modules/functions.js')(client);
require('./modules/economy.js')(client);
require('./modules/stats.js')(client);
require('./modules/votes.js')(client);

// Databases

client.settings = new Enmap({name: "settings"});
client.usersdata = new Enmap({name: "usersdata"});
client.stats_db = new Enmap({name: "stats"});
client.stats_array = new Enmap({name: "stats_array"});
client.points = new Enmap({name: "points"});
client.balance = new Enmap({name: "balance"});
client.presentes = new Enmap({name: "gifts"});
client.votes_db = new Enmap({name: "votes"});

// Languages Configuration

const languagesFolder = readdirSync('./languages/');

languagesFolder.forEach(file => {
  client.languages.push(file.split('.')[0]);
});

i18n.configure({
  locales: ["en", "es", "pt_br"],
  directory: path.join(__dirname, "languages"),
  defaultLocale: "pt_br",
  objectNotation: true,
  register: global,
  autoReload: true,

  mustacheConfig: {
    tags: ["{{", "}}"],
    disable: false
  }
});


// Load extra files

const eventsFolder = readdirSync('./events/');
client.log('LOAD', `Carregando ${eventsFolder.length} eventos`);

eventsFolder.forEach(file => {
  try {
    const eventName = file.split('.')[0];
    const event = require(`./events/${file}`);

    client.on(eventName, event.bind(null, client));
  } catch (e) {
    client.log('ERROR', `${e}`);
  }
});

const categories = client.config.categories;
const loadedCommands = [];

categories.forEach(c => {
  const cmdFolder = readdirSync(`./commands/${c}`);
  cmdFolder.forEach(file => {
    try {
      const props = require(`./commands/${c}/${file}`);
      if(file.split(".").slice(-1)[0] !== "js") return;

      if(props.init) props.init(client);

      client.commands.set(props.config.name, props);
      props.config.aliases.forEach(alias => {
        client.aliases.set(alias, props.config.name);
      });

      loadedCommands.push(props.config.name)
    } catch (e) {
      client.log('ERROR', `Impossível executar comando ${file}: ${e}`);
    }
});
});

client.log(`LOAD`, `Carregando ${loadedCommands.length} comandos`);


// Discord Client Login
client.login(env.BOT_TOKEN);

client.log('LOAD', `Arquivo principal foi carregado e logado`);