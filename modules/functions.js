
const Discord = require("discord.js");
const Enmap = require("enmap");

module.exports = async client => {

    client.log = (type, content) => {
        const moment = require("moment"); require("moment-duration-format");
        moment.locale('pt-br');
        const actualTime = moment(Date.now()).format('DD/MM/YYYY@h:m');
        console.log(`[${actualTime}][${type}] ${content}`);
    };

    client.embed = (description) => {
        var x = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setDescription(description);
        return x;
    }

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

    client.kFormatter = (num) => {
        return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num);
    };

    client.projects = {
        cache: new Enmap({name: "projects"}),
        autouptade: autouptade = () => {
            const channelID = '822175587908452422';
            const messageID = '822473401264242689';

            if(client.channels.cache.has(channelID)) {

                client.channels.cache.get(channelID).messages.fetch({ limit: 1 })
                .then(messages => {

                    setInterval(function () {

                        const message = messages.get(messageID);

                        const Embed = new Discord.MessageEmbed()
                        .setColor('#8855ff')
                        .setTimestamp();

                        for (const projectID of client.config.projects) {
                            if(client.users.cache.has(projectID)) {
    
                                client.projects.cache.ensure(projectID, {
                                    id: projectID,
                                    status: 'ONLINE',
                                    description: '',
                                });
    
                                let project = client.projects.cache.get(projectID);
                                let user = client.users.cache.get(projectID);
    
                                let stts = project.status;
                                let status;
                                let status_text;
    
                                if(stts == 'ONLINE') {
                                    status = '<:online:792864058389823529>';
                                    status_text = 'Online';
                                } else if(stts == 'MAINTENCE') {
                                    status = '<:idle:792864178377195550>';
                                    status_text = 'Manutenção';
                                } else if(stts == 'DEPREDICATED') {
                                    status = '<:dnd:792864233120464908>';
                                    status_text = 'Depredicado';
                                } else if(stts == 'OFFLINE') {
                                    status = '<:offline:792864272199581756>';
                                    status_text = 'Offline';
                                };
    
                                Embed.addField(`${status_text}`, `${status} | ${user} - ${project.description}\n\n`);
                            };
                        };
    
                        message.edit(Embed);

                    }, 30000) //300000

                })
                .catch(console.error);

            }

        }
    };

};