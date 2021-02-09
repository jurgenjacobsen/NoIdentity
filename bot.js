// NPM Packages
const env = require('dotenv').config().parsed;

const Discord = require('discord.js');
const DBL = require('dblapi.js');

const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const { readdirSync } = require("fs");

const Enmap = require("enmap");
const moment = require("moment"); require("moment-duration-format");

// Clients
const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION']});

// Configs

client.config = require('./config.js');
client.version = require('./package.json').version;
client.dbl = new DBL(client.config.dbl_token, client);

client.default = client.config.default;
client.apiDocs = client.config.api;

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

require('./modules/functions.js')(client);
require('./modules/music.js')(client);

// Databases

client.settings = new Enmap({name: "settings", fetchAll: false, autoFetch: true, cloneLevel: "deep"});
client.usersdata = new Enmap({name: "usersdata", fetchAll: false, autoFetch: true, cloneLevel: "deep"});
client.premiums = new Enmap({name: "premiums", fetchAll: false, autoFetch: true, cloneLevel: "deep"});
client.stats = new Enmap({name: "stats", fetchAll: false, autoFetch: true, cloneLevel: "deep"});

// Load extra files

const eventsFolder = readdirSync('./events/');
client.log('LOAD', `Carregando ${eventsFolder.length} eventos`);

eventsFolder.forEach(file => {
    const eventName = file.split('.')[0];
    const event = require(`./events/${file}`);

    client.on(eventName, event.bind(null, client));
});

const cmdFolder = readdirSync("./commands/");
client.log(`LOAD`, `Carregando ${cmdFolder.length} comandos`);
cmdFolder.forEach(file => {
  try {
    const props = require(`./commands/${file}`);
    if (file.split(".").slice(-1)[0] !== "js") return;

    if (props.init) props.init(client);

    client.commands.set(props.config.name, props);
    props.config.aliases.forEach(alias => {
      client.aliases.set(alias, props.config.name);
    });
  } catch (e) {
    console.log(`Impossível executar comando ${file}: ${e}`);
  }
});

// Discord Client Login
client.login(env.BOT_TOKEN);

client.log('LOAD', `Arquivo principal foi carregado e logado`);