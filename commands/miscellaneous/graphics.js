const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

exports.run = async (Discord, client, message, args, i18n) => {

    const embed = new Discord.MessageEmbed()
    .setColor(client.config.color)
    .setDescription(i18n.__("command.graphics.whatyouwant"))
    .addField('ㅤ', `<:paper_icon:794273334615080982> - ${i18n.__("command.graphics.msg")}`)
    .addField('ㅤ', `<:stonks:813506789323964476> - ${i18n.__("command.graphics.members")}`)
    .addField('ㅤ', `<:worker:804839799374610482> - ${i18n.__("command.graphics.bans")}`)
    .addField('ㅤ', `<:news_icon:794269406241751041> - ${i18n.__("command.graphics.site")}`);

    const msg = await message.channel.send(message.author, embed);
                await msg.react('794273334615080982');
                await msg.react('813506789323964476');
                await msg.react('804839799374610482');
                await msg.react('794269406241751041');

    const filter = (reaction, user) => {
        return user.id === message.author.id;
    };
            
    const collector = msg.createReactionCollector(filter, {time: 60000, errors: ['time']});

    let messages_data = [];
    let commands_data = [];
    let datas = [];
    let bans_add = [];
    let bans_remove = [];
    let new_members = [];
    let leave_members = [];
    let page_visits = [];
    let bot_website_refers = [];
    let votes = [];

    let width = 800;
    let height = 600;

    let sliceDays;

    if(client.settings.get(message.guild.id, 'profile.isPremium')) {
        sliceDays = 5;
    } else {
        sliceDays = 12;
    };

    client.stats_array.get(message.guild.id).slice(sliceDays).map(date => {

        datas.push(date.slice(0, 5))

        messages_data.push(client.stats_db.get(`${message.guild.id}-${date}`).messages);
    
        commands_data.push(client.stats_db.get(`${message.guild.id}-${date}`).commands);

        bans_add.push(client.stats_db.get(`${message.guild.id}-${date}`).guildBanAdd);

        bans_remove.push(client.stats_db.get(`${message.guild.id}-${date}`).guildBanRemove);

        new_members.push(client.stats_db.get(`${message.guild.id}-${date}`).guildMemberAdd);

        leave_members.push(client.stats_db.get(`${message.guild.id}-${date}`).guildMemberRemove);

        page_visits.push(client.stats_db.get(`${message.guild.id}-${date}`).page_visits);

        bot_website_refers.push(client.stats_db.get(`${message.guild.id}-${date}`).bot_website_refers);

        votes.push(client.stats_db.get(`${message.guild.id}-${date}`).votes);

    });

    const chartCallback = (ChartJS) => {
        ChartJS.plugins.register({
            beforeDraw: (chartInstance) => {
                const { chart } = chartInstance
                const { ctx } = chart
                ctx.fillStyle = '#23272A'
                ctx.fillRect(0, 0, chart.width, chart.height)
            },
        });
    };

    const canvas = new ChartJSNodeCanvas({width, height, chartCallback});

    const configuration = {
        type: 'line',
        data: {
            labels: datas,
            datasets: [
                {   
                    label: i18n.__("command.graphics.commands"),
                    data: commands_data,
                    borderColor: '#8855ff',
                    fill: false,
                },
                {
                    label: i18n.__("command.graphics.messages"),
                    data: messages_data,
                    borderColor: "#cc55ff",
                    fill: false,
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: i18n.__("command.graphics.msg_title"),
            },
            legend: {
                labels: {
                    fontColor: 'white',
                    defaultFontFamily: "'Roboto', sans-serif",
                }
            },
            scales: {
                yAxes: [{
                    ticks:{
                        min : 0,
                        fontColor : "#fff",
                        fontSize : 14,

                    }
                }],
                xAxes: [{
                    ticks:{
                        min : 0,
                        fontColor : "#fff",
                        fontSize : 14
                    }
                }]
            }
        }
    };

    const configuration2 = {
        type: 'line',
        data: {
            labels: datas,
            datasets: [
                {   
                    label: i18n.__("command.graphics.joined_members"),
                    data: new_members,
                    borderColor: '#8855ff',
                    fill: false,
                },
                {
                    label: i18n.__("command.graphics.leave_members"),
                    data: leave_members,
                    borderColor: "#cc55ff",
                    fill: false,
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: i18n.__("command.graphics.members_title"),
            },
            legend: {
                labels: {
                    fontColor: 'white',
                    defaultFontFamily: "'Roboto', sans-serif",
                }
            },
            scales: {
                yAxes: [{
                    ticks:{
                        min : 0,
                        fontColor : "#fff",
                        fontSize : 14
                    }
                }],
                xAxes: [{
                    ticks:{
                        min : 0,
                        fontColor : "#fff",
                        fontSize : 14
                    }
                }]
            }
        }
    };

    const configuration3 = {
        type: 'line',
        data: {
            labels: datas,
            datasets: [
                {   
                    label: i18n.__("command.graphics.bannedMembers"),
                    data: bans_add,
                    borderColor: '#cc55ff',
                    fill: false,
                },
                {
                    label: i18n.__("command.graphics.unbannedMembers"),
                    data: bans_remove,
                    borderColor: "#8855ff",
                    fill: false,
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: i18n.__("command.graphics.bans_title"),
            },
            legend: {
                labels: {
                    fontColor: 'white',
                    defaultFontFamily: "'Roboto', sans-serif",
                }
            },
            scales: {
                yAxes: [{
                    ticks:{
                        min : 0,
                        fontColor : "#fff",
                        fontSize : 14
                    }
                }],
                xAxes: [{
                    ticks:{
                        min : 0,
                        fontColor : "#fff",
                        fontSize : 14
                    }
                }]
            }
        }
    };

    const configuration4 = {
        type: 'line',
        data: {
            labels: datas,
            datasets: [
                {   
                    label: i18n.__("command.graphics.page_visits"),
                    data: page_visits,
                    borderColor: '#cc55ff',
                    fill: false,
                },
                {
                    label: i18n.__("command.graphics.page_refers"),
                    data: bot_website_refers,
                    borderColor: "#8855ff",
                    fill: false,
                },
                {
                    label: i18n.__("command.graphics.votes"),
                    data: votes,
                    borderColor: "#ff5563",
                    fill: false,
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: i18n.__mf("command.graphics.page_flow_title", {GUILDID: message.guild.id}),
            },
            legend: {
                labels: {
                    fontColor: 'white',
                    defaultFontFamily: "'Roboto', sans-serif",
                }
            },
            scales: {
                yAxes: [{
                    ticks:{
                        fontColor : "#fff",
                        fontSize : 14,
                        min : 0,
                    }
                }],
                xAxes: [{
                    ticks:{
                        min : 0,
                        fontColor : "#fff",
                        fontSize : 14
                    }
                }]
            }
        }
    };

    const image = await canvas.renderToBuffer(configuration);
    const image2 = await canvas.renderToBuffer(configuration2);
    const image3 = await canvas.renderToBuffer(configuration3);
    const image4 = await canvas.renderToBuffer(configuration4);

    collector.on('collect', async (reaction, user) => {

        let returnMessage;

        if(reaction.emoji.id === '794273334615080982') {

            let attachment = new Discord.MessageAttachment(image, 'graphic.png');
            returnMessage = await message.channel.send(message.author, attachment);
            collector.stop();
            msg.delete();

        } else if(reaction.emoji.id === '813506789323964476') {

            let attachment = new Discord.MessageAttachment(image2, 'graphic.png');
            returnMessage = await message.channel.send(message.author, attachment);
            collector.stop();
            msg.delete();

        } else if(reaction.emoji.id === '804839799374610482') {

            let attachment = new Discord.MessageAttachment(image3, 'graphic.png');
            returnMessage = await message.channel.send(message.author, attachment);
            collector.stop();
            msg.delete();

        } else if(reaction.emoji.id === '794269406241751041') {

            let attachment = new Discord.MessageAttachment(image4, 'graphic.png');
            returnMessage = await message.channel.send(message.author, attachment);
            collector.stop();
            msg.delete();

        }

        returnMessage.react('⬅️');

        const collector2 = returnMessage.createReactionCollector(filter, {time: 60000, errors: ['time']});
              
        collector2.on('collect', async (reaction, user) => {
            if(reaction.emoji.name === '⬅️') {
                client.commands.get("graphics").run(Discord, client, message, args, i18n);
                collector2.stop();
                returnMessage.delete();
            }
        });

    });

};

exports.config = {
    name: 'graphics',
    enabled: true,
	guildOnly: true,
    aliases: ['graficos', 'grafico', 'graphic'],
    permissions: ['SEND_MESSAGES']
};

exports.help = {
	name: 'graphics',
	category: 'Diversos',
	description: 'Mostra estatísticas sobre o servidor',
	usage: 'graphics'
};