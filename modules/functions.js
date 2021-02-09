const Discord = require("discord.js");
const path = require("path");

module.exports = async client => {

    client.log = (type, content) => {
        const moment = require("moment"); require("moment-duration-format");
        moment.locale('pt-br');
        const actualTime = moment(Date.now()).format('DD/MM/YYYY@h:m');
        console.log(`[${actualTime}][${type}] ${content}`);
    };

    client.radioSearch = async () => {
        client.joinedRadioChannels = [];

        client.guilds.cache.forEach(guild => {
            if(guild.voice) {
                guild.channels.cache.get(guild.voice.channelID).leave();
            };

            const cfg = client.settings.get(guild.id);
            if(!cfg) return;
            const config = cfg.custom_configs;
    
            if(config.radio_channelID) {
                if(guild.channels.cache.get(config.radio_channelID)) {
                    guild.channels.cache.get(config.radio_channelID).join()
                    .then(connection => {
                        connection.voice.setSelfDeaf(true);
                    });
                    client.joinedRadioChannels.push(config.radio_channelID);
                };
            };
        });

        client.log('CLIENT', `Entrei em ${client.joinedRadioChannels.length} canais de rádio`);
    };

    client.datacheck = async () => {
        client.users.cache.forEach(user => {
            client.usersdata.ensure(user.id, client.config.default.user_settings);
        });

        client.guilds.cache.forEach(guild => {
            client.settings.ensure(guild.id, client.config.default.guild_settings);
        });
        client.log('DATABASE', `Completei todos as configurações que estavam vazias`);
    };

    client.clean = (client, text) => {

		if (typeof evaled !== 'string') text = require('util').inspect(text, { depth: 0 });

		var t = text
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203))
			.replace(/\n/g, '\n' + String.fromCharCode(8203))
			.replace(client.config.token, 'NO TOKEN HERE')
			.replace(client.config.oauth, 'NO OAUTH HERE');
		return t;
    };
    
    client.genUserToken = () => {
        let length = 32;
        var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
        var b = [];  
        for (var i=0; i<length; i++) {
            var j = (Math.random() * (a.length-1)).toFixed(0);
            b[i] = a[j];
        }
        return b.join("");
    };

    client.genUserID = () => {
        let length = 18;
        var a = "1234567890".split("");
        var b = [];  
        for (var i=0; i<length; i++) {
            var j = (Math.random() * (a.length-1)).toFixed(0);
            b[i] = a[j];
        }
        return b.join("");
    };

    client.genAPIToken = () => {
        let length = 64;
        let a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_$-".split("");
        let b = [];  
        for (var i=0; i<length; i++) {
            var j = (Math.random() * (a.length-1)).toFixed(0);
            b[i] = a[j];
        }
        return b.join("");
    };

    client.genAPID = () => {
        let length = 20;
        let a = "1234567890".split("");
        let b = [];  
        for (var i=0; i<length; i++) {
            var j = (Math.random() * (a.length-1)).toFixed(0);
            b[i] = a[j];
        }
        return b.join(""); 
    };

    client.statsFunction = (method, type, command) => {
        if(method === 'POST') {
            if(type === 'COMMAND') {
                client.stats.math(`stats`, `add`, 1, `ran_commands`);
                if(command === 'MUSIC') {
                    client.stats.math(`stats`, `add`, 1, `songs_listened`);
                };
            };
        } else if(method === 'GET') {
            return client.stats.get('stats');
        };
    };

    client.suggestion = async (type, object, user) => {

        if(true) return;

        function createID() {
            let length = 10;
            var a = "1234567890".split("");
            var b = [];  
            for (var i=0; i<length; i++) {
                var j = (Math.random() * (a.length-1)).toFixed(0);
                b[i] = a[j];
            }
            return b.join("");
        };

        const channelID = client.config.bot_guild.suggestion_channel;

        if(type === 'MESSAGE') {
            if (object.channel.id === channelID) {
                if (object.content.length >= 4) {

                    let suggestion = {
                        id: createID(),
                        content: object.content,
                        author: object.author,
                        upvotes: 1,
                        downvotes: 0,
                        approved: false,
                    };

                    client.stats.push(`stats`, suggestion, `suggestions`);

                    object.delete();

                    let Embed = new Discord.MessageEmbed()
                    .setColor(client.config.color)
                    .setDescription(`Sugestão: ${suggestion.content}`)
                    .setAuthor(object.author.tag, object.author.displayAvatarURL());
                    object.channel.send(`||${suggestion.id}||`, Embed).then(msg => {
 
                    msg.react("785248178752585750")
                    .then(() => msg.react("785248178836340747"))
                    .catch(() => {
                        console.log("Um dos emojis falharam ao serem adicionados.")
                    });
                    });
                }
            }
        } else if(type === 'REACTION') {
            if(object._emoji.id == '785248178752585750') { //Sim
        
            } else if(object._emoji.id == '785248178836340747') {// Nao

            }
        }
    };
    
};